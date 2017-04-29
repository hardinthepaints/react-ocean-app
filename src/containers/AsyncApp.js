import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Horizontal, Vertical } from 'react-stack';
import ContainerDimensions from 'react-container-dimensions';

var FPSStats = require('react-stats').FPSStats;
var __DEV__ = true;

import { fetchDataIfNeeded, playPausePress, scrubber, range, speedSlider, setCurrentFrame, modeToggle, colorRange, arrow } from '../actions'

/* Import my custom components */
import HeatmapUI from '../components/plotly_heatmap/HeatmapUI'
import Controls from '../components/controls/Controls'
import MyThree from '../components/three/MyThree'
import MyLoader from '../components/MyLoader'


var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


class AsyncApp extends Component {
    
    constructor( props ){
        super(props);
        this.handleChange = this.handleChange.bind( this )
        this.handleButtonClick = this.handleButtonClick.bind( this )
        this.handleRangeChange = this.handleRangeChange.bind( this )
        this.handleSpeedChange = this.handleSpeedChange.bind( this )
        this.play = this.play.bind( this )
        this.pause = this.pause.bind( this )
        this.handleModeToggle = this.handleModeToggle.bind(this)
        this.getHeatmap = this.getHeatmap.bind(this);
        this.getMaxFrame = this.getMaxFrame.bind( this );
        this.handleColorRange = this.handleColorRange.bind(this);
        this.handleArrow = this.handleArrow.bind(this)
    }
    
    componentDidMount(){
        const { dispatch } = this.props        
        dispatch( fetchDataIfNeeded() );
        
    }
    
    componentWillReceiveProps( nextProps ){
        const { isPlaying } = this.props.ui;
        
        /* If the state just changed to playing */
        if ( isPlaying !== nextProps.ui.isPlaying ) {
            switch( nextProps.ui.isPlaying ){
                case true:
                    /* If not playing --> start animation*/
                    this.play()
                    
                case false:
                    /* If playing --> pause animation*/
                    this.pause();
                default:
                    this.pause();
            }
            
        }
        
    }
    
    /* Pause the animation */
    pause() {
        const {animationRequestID} = this.props.ui;
        if (animationRequestID) cancelAnimationFrame( animationRequestID  );    
    }
    
    /* Play the animation */
    play(){
        
        var start, progress, nextFrame, lastFrame;
        
        const { dispatch, allowedFrames } = this.props;
        const { speed, range, animationRequestID } = this.props.ui;
        var currentFrame = this.props.ui.currentFrame - range[0];
        
        
        /* An array of the frames in the current range */
        var framesInRange = allowedFrames;
        
        /* "step" to the next frame */
        function step( timeStamp ){
            
            
            if (!start) start = timeStamp;
            if (! nextFrame) nextFrame = currentFrame;
            
            progress = timeStamp - start;
            
            /* Select the next frame from the array of available frames */
            nextFrame = (currentFrame + Math.round(progress/(100 - speed))) % ( framesInRange.length );
            //nextFrame = (nextFrame + 1) % ( framesInRange.length );
            
            
            /* cancel the last animation request if necessary */
            //if ( animationRequestID  ) cancelAnimationFrame( animationRequestID  );
            
            
            /* Change the state to the next frame */
            dispatch( setCurrentFrame( framesInRange[ nextFrame ], requestAnimationFrame(step) ));
            
            
        }
                
        
        dispatch(setCurrentFrame( currentFrame, requestAnimationFrame(step) ));
           
    }
    
    handleButtonClick(){
        this.props.dispatch( playPausePress() );
    }
    
    handleChange( nextFrame ) {
        this.props.dispatch( scrubber( nextFrame ) );
    }
    
    handleRangeChange(values){
        if ( this.props.ui.isPlaying ) {
            this.pause();
            this.play();
        }
        this.props.dispatch( range( values ) );        
    }
    
    handleSpeedChange( speed ){
        this.props.dispatch( speedSlider(speed) );
        if ( this.props.ui.isPlaying ) {
            this.pause();
            this.play();
        }
    }
    
    handleModeToggle(){
        this.props.dispatch( modeToggle() )
    }
    
    handleColorRange(range){
        this.props.dispatch(colorRange(range))
    }
    
    getMaxFrame(){
        const {frames} = this.props;
        return !frames || (frames.length==0) ? 100 : frames.length - 1;
    }
    
    /* Get the component representing the heatmap */
    getHeatmap(){
        
        const {currentFrame, colorRange, isPlaying} = this.props.ui;
        return (
            <ContainerDimensions >
                { ({ width, height }) =>
                    <HeatmapUI
                        frames={this.props.frames}
                        currentFrame={currentFrame}
                        width={width}
                        height={height}
                        id={"graphDiv"}
                        colorRange={colorRange}
                        isPlaying={isPlaying}
                    />
                }
            </ContainerDimensions>
        );
    }
    
    getMyThree = () =>{
        
        const {frames} = this.props;
        const {currentFrame, colorRange} = this.props.ui
        
        return (
            <ContainerDimensions >
                { ({ width, height }) =>
                    <MyThree
                        width={width}
                        height={height}
                        frames={frames}
                        currentFrame={currentFrame}
                        colorRange={colorRange}/>
                }
            </ContainerDimensions>
        );
    }
    
    handleArrow(right){
        const {currentFrame, range, isPlaying} = this.props.ui
        const {dispatch, allowedFrames} = this.props;
        
        //this.props.dispatch( scrubber( currentFrame ) );
        var currentFrameIndex = currentFrame - range[0];
                        
        /* Get the next frame, and loop around if necessary*/
        var nextFrame = allowedFrames[(currentFrameIndex + (right ? 1 : -1) + allowedFrames.length) % allowedFrames.length]
        
        dispatch( arrow( nextFrame ) );
    }
    
    render() {
        
        const {mapIsOn, currentFrame} = this.props.ui
        const {frames} = this.props;

        return (
            
            <Vertical alignItems={'center'} alignContent={'space-around'} >
                    <Horizontal alignItems={'center'} alignContent={'space-around'} className="Inner">

                        <Controls
                            ui={this.props.ui}
                            dateString={frames.length>0 ? frames[currentFrame].yyyymmddhh : ""}
                            handleButtonClick={this.handleButtonClick}
                            handleModeToggle={this.handleModeToggle}
                            handleSpeedChange={this.handleSpeedChange}
                            handleRangeChange={this.handleRangeChange}
                            handleChange={this.handleChange}
                            getMaxFrame={this.getMaxFrame}
                            handleColorRange={this.handleColorRange}
                            handleArrow={this.handleArrow}
                        />
                    
                        <div className = "Right">
                            { (frames && frames.length>0) ?
                                /* Either show a plotly heatmap or three.js */
                                (mapIsOn ? this.getMyThree() : this.getHeatmap())
                                
                                /* If data have not come in yet, then show loader*/
                                : <MyLoader loaded={frames.length!=0}/>
                            }
                        </div>
                        
                    </Horizontal>
                    {/*Stats */}
                    <FPSStats isActive={__DEV__} />
                    
            </Vertical>

        )
    }
}

AsyncApp.propTypes = {
    frames:PropTypes.array.isRequired,
    allowedFrames:PropTypes.array.isRequired,

    
    ui:PropTypes.shape( {
        isPlaying:PropTypes.bool.isRequired,
        speed:PropTypes.number.isRequired,
        range:PropTypes.array.isRequired,
        currentFrame:PropTypes.oneOfType( [ PropTypes.string.isRequired, PropTypes.number.isRequired ] ),
        mapIsOn:PropTypes.bool.isRequired,
    }),                       

    dispatch:PropTypes.func.isRequired,
}

function mapStateToProps( state ) {
        
    const { ui,frames, allowedFrames } = state;
    const {currentFrame, range, speed, isPlaying} = ui;
        
    return {ui,frames, allowedFrames}
}

export default connect( mapStateToProps)(AsyncApp) ;