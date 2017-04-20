//components/HeatmapUI.js
import React, { Component, PropTypes } from 'react';
import MyLoader from './MyLoader'
import MyHeatmap from '../heatmap/myheatmap'
import Isvg from 'react-inlinesvg'

class HeatmapUI extends Component {
  
  constructor(props){
    super(props)
    this.state={
        myheatmap:null,
        svg:{}
    }
    this.getWidthHeight = this.getWidthHeight.bind(this)
    this.createHeatmapIfFrames = this.createHeatmapIfFrames.bind(this)
    this.svgCallBack = this.svgCallBack.bind(this)
    
  }
  
  /* If there are frames but the heatmap is not initialized, initialize it */
  createHeatmapIfFrames(){
      const{id, frames, currentFrame} = this.props

    
      if ((!this.state.myheatmap && frames && frames.length > 0)) {
          const{width, height} = this.getWidthHeight();
          this.setState( {myheatmap:new MyHeatmap(id, frames, width, height, this.svgCallBack)} );
      }
  }
  
  /* Callback for when plotly exports to svg*/
  svgCallBack(url, currentFrame){
    console.log("svgCallBack" + currentFrame)
      //this.setState({svg:Object.assign({}, this.state.svg, {[currentFrame]:url} )});

  }
  
  componentDidMount(){
      //const {id, dispatch, height} = this.props
      //dispatch( initHeatmap( id, frames ) ) ;
      console.log("component mounted")
      const{id, frames, currentFrame} = this.props

      this.createHeatmapIfFrames()
  }
  
  componentDidUpdate( prevProps ){
    const{id, frames, currentFrame} = this.props
    
    this.createHeatmapIfFrames()

    //play a frame by providing data
    //if ( this.state.myheatmap && (prevProps.currentFrame !== currentFrame)) {
    //    this.state.myheatmap.playFrames([frames[currentFrame]])
    //}
    
    //play an already added frame if needed
    if ( this.state.myheatmap && (prevProps.currentFrame !== currentFrame)) {
        this.state.myheatmap.playFrame(currentFrame)
        
    }    
  }
  
  getWidthHeight(){
      const {frames, width, height} = this.props
      var ratio = frames[0].ratio
      return {width:height*ratio + 100, height:height}
  }

  render() {
      const {frames, id, currentFrame} = this.props
      if (frames && frames.length>0) {
        const{width, height} = this.getWidthHeight();
        return (
          <div id={id}
              className={id}
              style={{height:height,
              width:width, position:"relative"}}>
              
              {/*Load an svg if there is a url to load*/}
              {/* { currentFrame in this.state.svg ? <Isvg src={this.state.svg[currentFrame]} id={"myImage"} style={{width:"100%", height:"100%", position:"absolute", top:0, left:0}} /> : null} */}
          </div>) ;   
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
