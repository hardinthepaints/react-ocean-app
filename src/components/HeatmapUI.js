//components/HeatmapUI.js
import React, { Component, PropTypes } from 'react';
import { initHeatmap } from '../actions'
import MyLoader from './MyLoader'
import MyHeatmap from '../heatmap/myheatmap'



  
class HeatmapUI extends Component {
  
  constructor(props){
    super(props)
    this.state={
        myheatmap:null
    }
    //this.calculateDims = this.calculateDims.bind(this)
  }
  
  componentDidMount(props){
      //const {id, dispatch, height} = this.props
      //dispatch( initHeatmap( id, frames ) ) ;  
  }
  
  componentDidUpdate( prevProps ){
    const {id, frames, currentFrame, width, height} = this.props
    if (prevProps.frames.length===0 && frames.length>0) {
        this.setState( {myheatmap:new MyHeatmap(id, [frames[currentFrame]], width, height)})
    }
    
    if ( this.state.myheatmap && (prevProps.currentFrame !== currentFrame)) {
        this.state.myheatmap.playFrames([ frames[currentFrame] ])
    }
  }

  render() {
      const {frames, id, width, height} = this.props
      if (frames && frames.length>0) {
        return (
          <div id={id}
              className={id}
              style={{height:height,
              width:width}}></div>) ;   
      } else {
        return (
            <MyLoader loaded={frames.length!=0}>
            </MyLoader>)
      }
  }
}



HeatmapUI.propTypes = {
  id:PropTypes.string.isRequired,
  height:PropTypes.number.isRequired,
  width:PropTypes.number.isRequired,
  currentFrame:PropTypes.number.isRequired,
  frames:PropTypes.array
}

module.exports = HeatmapUI;
