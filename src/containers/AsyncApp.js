import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Horizontal, Vertical } from 'react-stack';
import ContainerDimensions from 'react-container-dimensions'

var FPSStats = require('react-stats').FPSStats;
var __DEV__ = true;

import { fetchDataIfNeeded, playPausePress, scrubber, range, speedSlider, setCurrentFrame } from '../actions'

/* Import my custom components */
import MySlider from '../components/MySlider'
import MyRange from '../components/MyRange'
import HeatmapUI from '../components/HeatmapUI'
import PlayPauseButton from '../components/PlayPauseButton'
import MyNavBar from '../components/MyNavBar'


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
        //this.getMaxFrame = this.getMaxFrame.bind( this )
    }
    
    componentDidMount(){
        const { dispatch } = this.props        
        dispatch( fetchDataIfNeeded() );
        
    }
    
    componentDidUpdate( prevProps ){
        const { dispatch } = this.props;
        const { currentFrame, isPlaying } = this.props.ui;
        
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
        
        var start, progress, nextFrame;
        
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
            if ( animationRequestID  ) cancelAnimationFrame( animationRequestID  );
            
            /* Change the state to the next frame */
            dispatch( setCurrentFrame( framesInRange[ nextFrame ], requestAnimationFrame(step) ));
            
            /* Fetch data if necessary */
            //dispatch( fetchDataIfNeeded( framesInRange[ nextFrame ] ));

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
        this.props.dispatch( speedSlider(speed) )
        if ( this.props.ui.isPlaying ) {
            this.pause();
            this.play();
        }
    }
    
    getMaxFrame(){
        const {frames} = this.props;
        return !frames || (frames.length==0) ? 100 : frames.length - 1;
    }
    
    render() {
        
        
        return (
        <Vertical alignItems={'center'} alignContent={'space-around'} >
            {/*Modal */}
            <MyNavBar/>
            
            <Horizontal alignItems={'center'} alignContent={'space-around'} className="Inner">
                <div className = "navbar navbar-default Left">      
                
                    <div className = "Wrap">
                      <PlayPauseButton onClick={this.handleButtonClick} value={this.props.ui.isPlaying}/>
                    </div>
                    
                    {/* Scubber */}
                    <div className = "Wrap">
                        <Horizontal alignItems={'center'} alignContent={'space-around'} >
                            <span  className="SmallGrayFont">{"frame:"}</span>
                            <span className="LargeGrayFont"> {this.props.ui.currentFrame} </span>
                        </Horizontal>
                    
                      <MySlider onChange={this.handleChange} value={this.props.ui.currentFrame} min={0}
                      max={this.getMaxFrame()} />
                    </div>
                    
                    {/* Range slider */}
                      <div className = "Wrap">
                        <Horizontal alignItems={'center'} alignContent={'space-around'} >
                            <span className="LargeGrayFont" >{ "[" + this.props.ui.range[0] + ":" + this.props.ui.range[1] + "]"}</span>
                        </Horizontal>
                      <MyRange onChange={this.handleRangeChange} value={this.props.ui.range} min={0} max={this.getMaxFrame()}  />
                    </div>
                    
                    {/* Speed slider */}
                    <div className = "Wrap">
                        <Horizontal alignItems={'center'} alignContent={'space-around'} >
                            <span  className="SmallGrayFont">{"speed:"}</span>
                            <span  className="LargeGrayFont">{this.props.ui.speed}</span>
                        </Horizontal>
                      <MySlider onChange={this.handleSpeedChange} value={this.props.ui.speed} min={0} max={99} />
                    </div>
        
                  
                </div>
            
            
                <div className = "Right">
                    <ContainerDimensions >
                        { ({ width, height }) => 
                            <HeatmapUI
                                frames={this.props.frames}
                                currentFrame={this.props.ui.currentFrame}
                                width={width}
                                height={height}
                                id={"graphDiv"}
                                />
                        }
                    </ContainerDimensions>
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
    }),                       

    dispatch:PropTypes.func.isRequired,
}

function mapStateToProps( state ) {
        
    const { ui,frames } = state;
    const {currentFrame, range, speed, isPlaying} = ui;
    
    //const { isFetching, data } = hours[ui.currentDate][ui.currentHour] || { isFetching:true, data:[] }
    
    return {ui,frames}
}

export default connect( mapStateToProps)(AsyncApp) ;