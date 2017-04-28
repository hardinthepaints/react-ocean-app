import React, { Component, PropTypes  } from 'react';

//import './MySlider.css';

import ReactBootstrapSlider from 'react-bootstrap-slider';


//require('rc-tooltip/assets/bootstrap.css');

//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';



class MySlider extends Component {
    
    componentDidMount(){
        /* pass an initial value to the call back functions */
        const {value,onChange} = this.props
        onChange(value)
    }
    
    componentDidUpdate(prevProps){
        const {min, max, onChange, value} = this.props;
        if ( min !== prevProps.min || max != prevProps.max) {
            onChange(value)
        }
    }

    render() {
  
        return (
            
            // <Slider className={"rc-slider"}
            //
            //onChange={this.props.onChange}
            ///* onBeforeChange={this.props.onChange} */
            //onAfterChange={this.props.onChange}
            //value={this.props.value}
            //min={this.props.min}
            //max={this.props.max}
            //
            ///> 
            
            <ReactBootstrapSlider
  
            change={(result) => this.props.onChange(result.target.value)}
            /* onBeforeChange={this.props.onChange} */
            /* slideStop={this.props.onChange} */
            value={this.props.value}
            min={this.props.min}
            max={this.props.max}
            handle={"square"}
            selection={"before"}
  
            />
        );
      
    }
}

MySlider.propTypes = {
    onChange:PropTypes.func.isRequired,
    value:PropTypes.oneOfType( [ PropTypes.array.isRequired, PropTypes.number.isRequired ] ),
    min:PropTypes.number.isRequired,
    max:PropTypes.number.isRequired,
}

export default MySlider;
