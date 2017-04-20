//components/Heatmap.js

/* Wrapper for react native button to make it a play/pause button */

import React, { Component, PropTypes } from 'react';

import './PlayPauseButton.css';

import ToggleButton from 'react-toggle-button';



const PAUSE = React.createElement("strong",{},"| |");
const PLAY =  React.createElement("x",{},"\u25B6");

class MyToggle extends Component {
  
  render() {
    

    return (
      <ToggleButton
        
        value={this.props.value}
        onToggle={this.props.onClick}
        activeLabel={ this.props.active ? this.props.active : PAUSE }
        inactiveLabel={ this.props.inactive ? this.props.inactive : PLAY }
        trackStyle={{width:500, height:25}}
        thumbStyle={{width:25, height:25, left:-5,}}
        animateThumbStyleHover={(n) => {
        return {
            boxShadow: `0 0 ${2 + 4*n}px rgba(0,0,0,.16),0 ${2 + 3*n}px ${4 + 8*n}px rgba(0,0,0,.32)`,
          }
        }}
        colors={{
          activeThumb: {
            base: 'rgb(250,250,250)',
          },
          inactiveThumb: {
            base:'rgb(250,250,250)',
          },
          active: {
            base: 'rgb(0, 147, 2)',
            hover: "rgb(0, 180, 2)",
          },
          inactive: {
            base: 'rgb(65,66,68)',
            hover: 'rgb(95,96,98)',
          }
        }}
        />
        
    );
  }

}

MyToggle.PropTypes = {
  onClick:PropTypes.func.isRequired,
  value:PropTypes.bool.isRequired
}

module.exports = MyToggle;
