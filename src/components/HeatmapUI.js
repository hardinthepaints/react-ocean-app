//components/HeatmapUI.js
import React, { Component, PropTypes } from 'react';
import { initHeatmap } from '../actions'


  
class HeatmapUI extends Component {
  
  constructor(props){
    super(props)
    this.calculateDims = this.calculateDims.bind(this)
  }
  
  componentDidMount(props){
      const {id, dispatch, height} = this.props
      dispatch( initHeatmap( id, this.props.height, this.props.width ) ) ;  
            
    
  }
  
  componentDidUpdate( prevProps ){    
      const {width, height, onSizeChange } = this.props
      if ( prevProps.width !== width || prevProps.height !== height) {
        onSizeChange( width, height )
      }
    
  }
  
  calculateDims(){
    
    const {width, height, heatmap} = this.props;
    
    //if ( heatmap ) {
    //  
    //    var extra = heatmap.trace.colorbar.thickness + heatmap.trace.colorbar.xpad
    //
    //
    //    if ( (height * heatmap.ratio + extra) < width ) {
    //      console.log( "Wider than long" )
    //      return [height * heatmap.ratio + extra, height]
    //    } else {
    //      return [ width, (width - extra) / heatmap.ratio ]
    //    }
    //}
    //  
    //else
    
    if (heatmap ) {
      var out = [ width, width / heatmap.ratio ]
      
      return out;
    }
    else return ([width, height])
    
    
  }
  
  
  
  render() {
    var dims = this.calculateDims();
    
    
    return (
      <div id={this.props.id} className={"GraphDiv"} style={{height:dims[1], width:dims[0]}}></div>
    )
  }
}



HeatmapUI.propTypes = {
  id:PropTypes.string.isRequired,
  dispatch:PropTypes.func.isRequired,
  height:PropTypes.number.isRequired,
  width:PropTypes.number.isRequired,
  onSizeChange:PropTypes.func.isRequired
}

module.exports = HeatmapUI;
