import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Horizontal, Vertical } from 'react-stack';
import ContainerDimensions from 'react-container-dimensions';

var FPSStats = require('react-stats').FPSStats;
var __DEV__ = true;

import { fetchDataIfNeeded, playPausePress, scrubber, range, speedSlider, setCurrentFrame, modeToggle } from '../actions'

/* Import my custom components */
import HeatmapUI from '../components/HeatmapUI'
import Controls from '../components/Controls'

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
        this.getMapbox = this.getMapbox.bind(this);
        this.getMaxFrame = this.getMaxFrame.bind( this )
    }
    
    componentDidMount(){
        const { dispatch } = this.props        
        dispatch( fetchDataIfNeeded() );
        
    }
    
    componentDidUpdate( prevProps ){
        const { isPlaying } = this.props.ui;
        
        /* If the state just changed to playing */
        if ( isPlaying !== prevProps.ui.isPlaying ) {
            switch( isPlaying ){
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
        
        const { dispatch } = this.props;
        const { speed, range, animationRequestID } = this.props.ui;
        var currentFrame = this.props.ui.currentFrame - range[0];
        
        
        /* An array of the frames in the current range */
        var framesInRange = Array.apply(null, Array(range[1] - range[0] + 1)).map(function (_, i) {return i + range[0];}); 
        
        /* "step" to the next frame */
        function step( timeStamp ){
            if (!start) start = timeStamp;
            if (! nextFrame) nextFrame = currentFrame;
            
            progress = timeStamp - start;
            
            /* Select the next frame from the array of available frames */
            nextFrame = (currentFrame + Math.round(progress/(100 - speed))) % ( framesInRange.length );

            
            
            /* cancel the last animation request if necessary */
            //if ( animationRequestID  ) cancelAnimationFrame( animationRequestID  );
            
            /* Change the state to the next frame */
            dispatch( setCurrentFrame( framesInRange[ nextFrame ], requestAnimationFrame(step) ));
            
            lastFrame = nextFrame;

        }
        
        dispatch(setCurrentFrame( currentFrame, requestAnimationFrame(step) ));
           
    }
    
    handleButtonClick(){
        this.props.dispatch( playPausePress() );
    }
    
    handleChange( nextFrame ) {
        this.props.dispatch( scrubber(nextFrame ) );
        //this.props.dispatch( fetchDataIfNeeded(nextFrame));
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
    
    getMaxFrame(){
        const {frames} = this.props;
        return !frames || (frames.length==0) ? 100 : frames.length - 1;
    }
    
    getHeatmap(){
        return (
            <ContainerDimensions >
                { ({ width, height }) =>
                    
                    <HeatmapUI
                        frames={this.props.frames}
                        currentFrame={this.props.ui.currentFrame}
                        width={width}
                        height={height}
                        on={!this.props.mapIsOn}
                        id={"graphDiv"}
                    />
    
                }
            </ContainerDimensions>
        );
    }
    
    getMapbox(){
        return (
            <div/>
        );
    }
    
    render() {
        
        const {mapIsOn} = this.props.ui
        
        /* Either display the mapbox or hetmap component */
        var DataVisualizer = mapIsOn ? this.getMapbox : this.getHeatmap;

        return (
            
            <Vertical alignItems={'center'} alignContent={'space-around'} >
                    <Horizontal alignItems={'center'} alignContent={'space-around'} className="Inner">

                        <Controls
                            ui={this.props.ui}
                            handleButtonClick={this.handleButtonClick}
                            handleModeToggle={this.handleModeToggle}
                            handleSpeedChange={this.handleSpeedChange}
                            handleRangeChange={this.handleRangeChange}
                            handleChange={this.handleChange}
                            getMaxFrame={this.getMaxFrame}  
                        />
                    
                        <div className = "Right">
                            <DataVisualizer/>
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
        
    const { ui,frames } = state;
    const {currentFrame, range, speed, isPlaying} = ui;
        
    return {ui,frames}
}

export default connect( mapStateToProps)(AsyncApp) ;