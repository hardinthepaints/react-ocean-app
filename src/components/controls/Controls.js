import React from 'react';
import { Horizontal } from 'react-stack';

import MySlider from './MySlider'
import MyRange from './MyRange'
import MyToggle from './MyToggle'
import './Controls.css'
import KeyHandler, {KEYDOWN, KEYUP } from 'react-key-handler';

/* Logic for how the controls look */
function Controls(props){
    
    const{isPlaying, currentFrame, range, mapIsOn, colorRange} = props.ui;
    const {dateString} = props;
    
    const MODE_MAP_ON = "MAP";
    const MODE_MAP_OFF = "PLOT";
    
    return (
        <div className="navbar navbar-default Left">
        
            <div className="Wrap">
            
                {/*Bind space key to this button*/}
                <KeyHandler keyEventName={KEYUP} keyValue={" "} onKeyHandle={props.handleButtonClick}/>
                <KeyHandler keyEventName={KEYUP} keyValue={"Spacebar"} onKeyHandle={props.handleButtonClick}/>

                <MyToggle onClick={props.handleButtonClick} value={isPlaying}/>
            </div>
            
            {/* Scrubber */}
            <div className="Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span  className="SmallGrayFont">{"frame:"}</span>
                    <span className="LargeGrayFont"> {currentFrame} </span>
                </Horizontal>
            
                <KeyHandler keyEventName={KEYDOWN} keyValue={"ArrowRight"} onKeyHandle={()=>{props.handleArrow(true)}}/>
                <KeyHandler keyEventName={KEYDOWN} keyValue={"ArrowLeft"} onKeyHandle={()=>{props.handleArrow()}}/>

            </div>
            
            <div className="Wrap">

                <MySlider onChange={props.handleChange} value={currentFrame} min={0} max={props.getMaxFrame()} />
            </div>

            
            {/* Range slider */}
              <div className="Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span className="LargeGrayFont" >{ "[" + props.ui.range[0] + ":" + props.ui.range[1] + "]"}</span>
                </Horizontal>
              <MySlider onChange={props.handleRangeChange} value={range} min={0} max={props.getMaxFrame()}  />
            </div>
            
            
            {/* Color Slider */}
              <div className="Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span className="SmallGrayFont" >{ "Color Range" }</span>
                </Horizontal>
              <MySlider onChange={props.handleColorRange} value={colorRange} min={0} max={33}  />
            </div>
            
            {/*NavBar */}
            <div className="Wrap">
                <KeyHandler keyEventName={KEYUP} keyValue={"m"} onKeyHandle={props.handleModeToggle}/>
                <MyToggle onClick={props.handleModeToggle} value={mapIsOn} active={MODE_MAP_OFF} inactive={MODE_MAP_ON}/>

            </div>
            
            {/*data readout*/}
            <div className="Wrap">
                <Horizontal alignItems={'center'} alignContent={'space-around'} >
                    <span className="SmallGrayFont" >{ dateString }</span>
                </Horizontal>
            </div>
        </div>        
        
    );
    
}

module.exports = Controls;