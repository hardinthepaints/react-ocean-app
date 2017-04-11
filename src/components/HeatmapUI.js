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
    this.getWidthHeight = this.getWidthHeight.bind(this)
  }
  
  componentDidMount(props){
      //const {id, dispatch, height} = this.props
      //dispatch( initHeatmap( id, frames ) ) ;  
  }
  
  componentDidUpdate( prevProps ){
    const {id, frames, currentFrame} = this.props
    if (prevProps.frames.length===0 && frames.length>0) {
        const{width, height} = this.getWidthHeight();
        this.setState( {myheatmap:new MyHeatmap(id, frames, width, height)})
    }
    
    if ( this.state.myheatmap && (prevProps.currentFrame !== currentFrame)) {
        this.state.myheatmap.playFrames([frames[currentFrame]])
    }
  }
  
  getWidthHeight(){
      const {frames, width, height} = this.props
      var ratio = frames[0].ratio
      return {width:width, height:width/ratio}
  }

  render() {
      const {frames, id} = this.props
      if (frames && frames.length>0) {
        const{width, height} = this.getWidthHeight();
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
