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
      const{id, frames, currentFrame, colorRange} = this.props

    
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
  
  shouldComponentUpdate(nextProps, nextState){
      return true;
  }
  
  componentDidMount(){
      //const {id, dispatch, height} = this.props
      //dispatch( initHeatmap( id, frames ) ) ;
      console.log("component mounted")
      const{id, frames, currentFrame} = this.props

      this.createHeatmapIfFrames()
  }
  componentWillUnmount(){
    this.state.myheatmap.purge();
  }
  
  componentDidUpdate( prevProps, prevState ){
    const{isPlaying, id, frames, currentFrame, colorRange} = this.props
    
    this.createHeatmapIfFrames()
    
    //play a frame if needed

    
    if ( this.state.myheatmap && ((prevProps.currentFrame !== currentFrame) || !prevState.myheatmap)) {
        this.state.myheatmap.playFrame(currentFrame, colorRange, frames)
    
    /* Change the color range on the same frame */
    } else if (!isPlaying && (colorRange[0] !== prevProps.colorRange[0] || colorRange[1] !== prevProps.colorRange[1])  ) {
        this.state.myheatmap.changeColorRange( colorRange )
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
