import React from 'react';
import { Horizontal } from 'react-stack';

import MySlider from './MySlider'
import MyRange from './MyRange'
import MyToggle from './MyToggle'
import MyNavBar from './MyNavBar'
import './Controls.css'

/* Logic for how the controls look */
function Controls(props){
    
    const{isPlaying, currentFrame, range, speed, mapIsOn} = props.ui;
    
    return (
        <div className="navbar navbar-default Left">
        
            <div className="Wrap">
              <MyToggle onClick={props.handleButtonClick} value={isPlaying} id={"playPauseButton"}/>
            </div>
            
            {/* Scubber */}
            <div className = "Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span  className="SmallGrayFont">{"frame:"}</span>
                    <span className="LargeGrayFont"> {currentFrame} </span>
                </Horizontal>
            
              <MySlider onChange={props.handleChange} value={currentFrame} min={0}
              max={props.getMaxFrame()} />
            </div>
            
            {/* Range slider */}
              <div className="Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span className="LargeGrayFont" >{ "[" + props.ui.range[0] + ":" + props.ui.range[1] + "]"}</span>
                </Horizontal>
              <MyRange onChange={props.handleRangeChange} value={range} min={0} max={props.getMaxFrame()}  />
            </div>
            
            {/* Speed slider */}
            <div className="Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span  className="SmallGrayFont">{"speed:"}</span>
                    <span  className="LargeGrayFont">{speed}</span>
                </Horizontal>
              <MySlider onChange={props.handleSpeedChange} value={speed} min={0} max={99} />
            </div>
            
            {/*NavBar */}
            <div className = "Wrap">
            
                <MyNavBar onModeToggle={props.handleModeToggle} isMapOn={mapIsOn}/>
            </div>
        </div>        
        
    );
    
}

module.exports = Controls;