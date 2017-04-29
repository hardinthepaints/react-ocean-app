import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom'
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import KeyHandler, {KEYUP } from 'react-key-handler';
import createColorscale from './MyColorscale'
import OrbitControls from './OrbitControls';

const landColor = new THREE.Color("rgb(255, 157, 0)")


class MyThree extends Component {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };

  constructor(props, context) {
        super(props, context);
    
        this.cameraPosition = new THREE.Vector3(0, 0, 300);
        this.lightPosition = new THREE.Vector3(100, 100, 300)

    
        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
    
        this.colorscale = createColorscale()
        
        this.cachedFaces = {}
    
        this.state = {
            ...this.state,
            wireframe:false,
            groupRotation: new THREE.Euler(0, 0, 0),
        };
        
        
        //this.cameraPosition = new THREE.Vector3(0, 150, 500);
        this.cubePosition = new THREE.Vector3(0, 0, 0);
    
        this.targetRotationYOnMouseDown = 0;
    
        this.mouseX = 0;
        this.mouseXOnMouseDown = 0;
        this.targetRotationY = 0;
        
    }
    
    

    
    componentDidMount(){
        const container = this.refs.container;
        
        const {currentFrame, frames} = this.props
        
        if ( frames.length > 0 ) {
            this.assignColors( this.props )
        }
        
        const controls = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.container))

        this.setState({
            controls:controls
        });
  
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        
    }
    
    componentWillReceiveProps( nextProps ){
        const {currentFrame, frames, colorRange} = nextProps

        
        if ( frames.length > this.props.frames.length ||
            (frames.length > 0 && (currentFrame !== this.props.currentFrame || colorRange !== this.props.coloRange)) 
        ) {
            this.assignColors( nextProps )
            //this.colorBufferedPlane();
        }
        
        
    }
    
    componentWillUnmount() {
        const container = this.refs.container;    
    }
    
    
    formatColorScale = (colorscale) => {
        for ( var i = 0; i < colorscale.length; i ++) {
            colorscale[i][1] = new THREE.Color( colorscale[i][1] ).getHex()
        }
        
        return colorscale;
    }
    
    getColor =( value )=>{
        
        const {colorRange} = this.props;
                
        value = value - colorRange[0]
        value = value / (colorRange[1] - colorRange[0])
        value = Math.min( Math.max(0, value), 1)
        
        return this.colorscale(value )
    }
    
    buildFrameKey = ( currentFrame, colorRange ) => {
        return currentFrame + "_" + colorRange[0] + "_" + colorRange[1]
    }
    
    getColorArray = ( z, index ) => {
        var triangleCount = z.length*2
        var colors = new Float32Array(197220)
        
        var color = new THREE.Color();
                
        
        for (var i = 0; i<triangleCount; i += 1){
            var value = z[i/2]
            var hex = (value !== null) ? this.getColor(value) : landColor.getHex()

            //color.setRGB( i / colors.length, i / colors.length, 1 );
            color.setHex(hex)
            
            var ind
            for (var vertexNumber = 0; vertexNumber < 2; vertexNumber++){
                ind = index[i*3 + vertexNumber]
            }
            
            colors[ind] = color.r;
            colors[ind+1] = color.g;
            colors[ind+2] = color.b;
        }
        
        return colors
    
    
    }
    
    colorBufferedPlane = ( ) =>{
        const plane = this.refs.plane
        console.log(plane)
        
        const{frames, currentFrame} = this.props
        
        var pointCount = plane.index.count
        
        var colors = this.getColorArray( frames[currentFrame].z, plane.index.array );
        
        console.log("colors length: " + colors.length)
        
        plane.addAttribute('color', new THREE.BufferAttribute( colors, 3 ))
    }        
    
    
    assignColors = ( props ) => {
        const { colorRange, frames, currentFrame } = props
        
        /* Reference the plane */
        const plane = this.refs.plane
        console.log(plane)
        
        
        var frameKey = this.buildFrameKey(currentFrame, colorRange  )
        
        const frame = frames[currentFrame].z;

        
        if ( frameKey in this.cachedFaces ) {
            var colors = this.cachedFaces[frameKey]
            for ( var i = 0; i < plane.faces.length; i += 2 ) {
            
                if ( frame[i/2]) {
                    
                    var face = plane.faces[ i ];
                    var hex = colors[i/2] ;
                    face.color.setHex(hex);
                    plane.faces[i+1].color.setHex(hex);
                }
        
            }
            
            
        } else {
            
            
            //create an array to store the calculated colors for caching            
            var colors = new Array(frame.length)
            
            for ( var i = 0; i < plane.faces.length; i += 2 ) {
        
                var value = frame[i / 2]
                var face = plane.faces[ i ];
                
                /* Get the color */
                var hex = (value !== null) ? this.getColor(value) : landColor.getHex()
                
                face.color.setHex(hex);
                plane.faces[i+1].color.setHex(hex);
                colors[i/2] = hex
                
            }
            this.cachedFaces[frameKey] = colors
        }
        plane.colorsNeedUpdate = true;
    
    }
    
    onAnimate = () => {
        this.onAnimateInternal()
        const {controls} = this.state
        if (controls) controls.update()
        

    }
    
    toggleWireframe = () => {
        this.setState({
            wireframe:!this.state.wireframe  
        })
    }
    
    onAnimateInternal() {
        const groupRotationY = this.state.groupRotation.y;
        
    
        if (Math.abs(groupRotationY - this.targetRotationY) > 0.0001) {
          this.setState({
            groupRotation: new THREE.Euler(0, groupRotationY +
              (this.targetRotationY - groupRotationY) * 0.05, 0),
          });
        }
    }
    
    render() {
        const {width,height,frames} = this.props;
            
        const {groupRotation,wireframe} = this.state;
        
            
        const z = frames[0].z;
    
        return (
            <div ref = "container">
               <KeyHandler keyEventName={KEYUP} keyValue={"w"} onKeyHandle={this.toggleWireframe}/>
               <React3
                   mainCamera="camera" // this points to the perspectiveCamera below
                   width={width}
                   height={height}
                   
                   forceManualRender={false}
                   /* onManualRenderTriggerCreated={(trigger)=> this.setState({doRender:trigger})} */
                   
                   onAnimate={this.onAnimate}
               >
                   <scene>
                        <perspectiveCamera
                            ref="camera"
                            name="camera"
                            fov={75}
                            aspect={width / height}
                            near={0.1}
                            far={1000}
                            position={this.cameraPosition}
                            lookAt={this.cubePosition}
                            //rotation={groupRotation}
                        />
                        <mesh
                            rotation={groupRotation}
                            position={this.cubePosition}
                        >
                            <planeGeometry
                                width={frames[0].width}
                                height={frames[0].height}
                                widthSegments={frames[0].width}
                                heightSegments={frames[0].height}
                                ref={"plane"}

                            />
 
                            <meshPhongMaterial
                                wireframe={wireframe}
                                vertexColors={THREE.FaceColors}
                            />
                        </mesh>
                        <pointLight
                            position={this.lightPosition}
                       />
                   </scene>
               </React3>
           </div>
            
        );

    }
}

MyThree.propTypes = {
    frames:PropTypes.array.isRequired,
    currentFrame:PropTypes.oneOfType( [ PropTypes.string.isRequired, PropTypes.number.isRequired ] ),
    height:PropTypes.number.isRequired,
    width:PropTypes.number.isRequired,
    colorRange:PropTypes.array.isRequired,
    isPlaying:PropTypes.bool.isRequired

}

export default MyThree;