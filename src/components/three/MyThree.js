import React, {PropTypes, Component} from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import KeyHandler, {KEYUP } from 'react-key-handler';
import createColorscale from './MyColorscale'

import heatmapConstants from '../plotly_heatmap/myheatmap.constants.json'
const {trace } = heatmapConstants


class MyThree extends Component {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };

  constructor(props, context) {
        super(props, context);
    
        this.cameraPosition = new THREE.Vector3(0, 0, 300);
    
        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
    
        this.colorscale = createColorscale( trace[0].colorscale )
    
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
        
        /* Add event listeners */
        container.addEventListener('mousedown', this.onDocumentMouseDown, false);
        container.addEventListener('touchstart', this.onDocumentTouchStart, false);
        document.addEventListener('touchmove', this.onDocumentTouchMove, false);
        
        const {currentFrame, frames} = this.props
        if ( frames.length > 0 ) {
            this.assignColors( frames[currentFrame] )
        }
    }
    
    componentWillReceiveProps( nextProps ){
        console.log("component will receive props: " );
        console.log( nextProps )
        const {currentFrame, frames, colorRange} = nextProps

        
        if ( frames.length > this.props.frames.length ||
            (frames.length > 0 && (currentFrame !== this.props.currentFrame || colorRange !== this.props.coloRange)) 
        ) {
            this.assignColors( frames[currentFrame] )
        }
    }
    
    componentWillUnmount() {
        const container = this.refs.container;
    
        container.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        container.removeEventListener('touchstart', this.onDocumentTouchStart, false);
        document.removeEventListener('touchmove', this.onDocumentTouchMove, false);
        document.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        document.removeEventListener('mouseup', this.onDocumentMouseUp, false);
        document.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    
    }
    
    onDocumentMouseDown = (event) => {
        event.preventDefault();
                    
        document.addEventListener('mousemove', this.onDocumentMouseMove, false);
        document.addEventListener('mouseup', this.onDocumentMouseUp, false);
        document.addEventListener('mouseout', this.onDocumentMouseOut, false);
    
        const {
          width,
        } = this.props;
    
        const windowHalfX = width / 2;
    
        this.mouseXOnMouseDown = event.clientX - windowHalfX;
        this.targetRotationYOnMouseDown = this.targetRotationY;
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
    
    assignColors = ( data ) => {
        var z = data.z;
        //z = z.reverse()
        
        const frame = [].concat.apply( [], z )
        
        const colorscale = trace[0].colorscale
        const plane = this.refs.plane
        if (plane) {
                    
            for ( var i = 0; i < plane.faces.length; i += 2 ) {

                var value = frame[i / 2]
                var face = plane.faces[ i ];
                if ( value !== null) {
                    var hex = this.getColor(value) ;
                    face.color.setHex(hex);
                    plane.faces[i+1].color.setHex(hex);
                }

                
            }                
            plane.colorsNeedUpdate = true;
        }
    }
    
    
    onDocumentMouseMove = (event) => {
        
        const {
          width,
        } = this.props;
    
        const windowHalfX = width / 2;
    
        this.mouseX = event.clientX - windowHalfX;
        this.targetRotationY = this.targetRotationYOnMouseDown +
          (this.mouseX - this.mouseXOnMouseDown) * 0.02; 
        
    }
    
    onDocumentMouseUp = () => {
        document.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        document.removeEventListener('mouseup', this.onDocumentMouseUp, false);
        document.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    };
  
    onDocumentMouseOut = () => {
        document.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        document.removeEventListener('mouseup', this.onDocumentMouseUp, false);
        document.removeEventListener('mouseout', this.onDocumentMouseOut, false);
    }; 
    
    onDocumentTouchStart = (event) => {
        if (event.touches.length === 1) {
            event.preventDefault();
      
            const {
                width,
                height
            } = this.props;
      
            const windowHalfX = width / 2;
      
            this.mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
            this.targetRotationYOnMouseDown = this.targetRotationY;
            
            
        }
    };

    onDocumentTouchMove = (event) => {
        if (event.touches.length === 1) {
            event.preventDefault();
      
            const {
                width,
            } = this.props;
      
            const windowHalfX = width / 2;
      
            this.mouseX = event.touches[0].pageX - windowHalfX;
            this.targetRotationY = this.targetRotationYOnMouseDown +
              (this.mouseX - this.mouseXOnMouseDown) * 0.05;
        }
    };
    
    onAnimate = () => {
        this.onAnimateInternal()
        

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
    const {
        width,
        height,
    } = this.props;
    
    const z = this.props.frames.length > 0 ? this.props.frames[0].z : [[1,2], [1,2]]
    //const z = [[1,2], [1,2]]
    
    const {
        groupRotation,
        wireframe,
    } = this.state;
    
    return (
    <div ref = "container">
        <KeyHandler keyEventName={KEYUP} keyValue={"w"} onKeyHandle={this.toggleWireframe}/>
        <React3
            mainCamera="camera" // this points to the perspectiveCamera below
            width={width}
            height={height}
            
            onAnimate={this.onAnimate}
        >
            <scene>
                <perspectiveCamera
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
                        width={z[0].length}
                        height={z.length}
                        widthSegments={z[0].length}
                        heightSegments={z.length}
                        ref={"plane"}                        
                    />
                    

                    <meshBasicMaterial
                        wireframe={wireframe}
                        vertexColors={THREE.FaceColors}
                    />
                </mesh>
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
    colorRange:PropTypes.array.isRequired

}

export default MyThree;