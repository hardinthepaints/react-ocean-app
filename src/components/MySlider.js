import React, { Component, PropTypes  } from 'react';
import '../App.css'; 

import Slider, { Range } from 'rc-slider';
import './MySlider.css';


require('rc-tooltip/assets/bootstrap.css');


class MySlider extends Component {

  render() {

      return (
          
           <Slider className={"rc-slider"}

          onChange={this.props.onChange}
          /* onBeforeChange={this.props.onChange} */
          onAfterChange={this.props.onChange}
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}

          />
      );
    
  }
}

MySlider.propTypes = {
    onChange:PropTypes.func.isRequired,
    value:PropTypes.number.isRequired,
    min:PropTypes.number.isRequired,
    max:PropTypes.number.isRequired,
}

export default MySlider;
