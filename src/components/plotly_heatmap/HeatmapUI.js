//components/heatmap/HeatmapUI.js
import React, { Component, PropTypes } from 'react';
import MyLoader from './MyLoader'
import MyHeatmap from './myheatmap'
import Isvg from 'react-inlinesvg'

class HeatmapUI extends Component {
  
  constructor(props){
    super(props)
    this.state={
        myheatmap:null,
    }
    this.getWidthHeight = this.getWidthHeight.bind(this)
    this.createHeatmapIfFrames = this.createHeatmapIfFrames.bind(this)
    
  }
  
  /* If there are frames but the heatmap is not initialized, initialize it */
  createHeatmapIfFrames(){
      const{id, frames, currentFrame, colorRange} = this.props
      
    
      if ((!this.state.myheatmap && frames && frames.length > 0)) {
      
          const{width, height} = this.getWidthHeight();
          this.setState( {myheatmap:new MyHeatmap(id, frames, width, height)} );
      }
  }
  
  //shouldComponentUpdate(nextProps, nextState){
  //    const{currentFrame, frames, colorRange} = this.props
  //    //currentFrame !== nextProps.currentFrame || colorRange !== nextProps.colorRange || 
  //    return (currentFrame !== nextProps.currentFrame || colorRange !== nextProps.colorRange || frames.length > 0 && !this.state.myheatmap) ;
  //}
  
  componentDidMount(){
      //const {id, dispatch, height} = this.props
      //dispatch( initHeatmap( id, frames ) ) ;
      console.log("component mounted")
      const{id, frames, currentFrame} = this.props

      this.createHeatmapIfFrames()
  }
  componentWillUnmount(){
    if (this.state.myheatmap) this.state.myheatmap.purge();
  }
  
  
  /* invoked before a mounted component receives new props.
   * If you need to update the state in response to prop changes
   * (for example, to reset it), you may compare this.props and nextProps
   * and perform state transitions using this.setState()
  */
  componentWillReceiveProps(nextProps){
    
      const{isPlaying, id, frames, currentFrame, colorRange} = nextProps
      const prevProps = this.props
      const prevState = this.state

      
      this.createHeatmapIfFrames()
        
      /* If heatmap was just initialize*/
      if ( this.state.myheatmap && !prevState.myheatmap ) {
          //this.state.myheatmap.playFrame(currentFrame)
          this.state.myheatmap.relayout(frames[currentFrame].z)

          this.state.myheatmap.changeColorRange( colorRange )
      }
      if ( this.state.myheatmap && ((prevProps.currentFrame !== currentFrame) || !prevState.myheatmap)) {
          //this.state.myheatmap.playFrame(currentFrame)
          this.state.myheatmap.relayout(frames[currentFrame].z)
        
      /* Change the color range on the same frame */
      } else if (!isPlaying && (colorRange[0] !== prevProps.colorRange[0] || colorRange[1] !== prevProps.colorRange[1])  ) {
          this.state.myheatmap.changeColorRange( colorRange )
      }
    
      
  }
  
  componentDidUpdate( prevProps, prevState ){
      
    
  }
  
  getWidthHeight(){
      const {frames, width, height} = this.props
      var ratio = frames[0].ratio
      return {width:height*ratio + 100, height:height}
  }
  
  getFrameDivs(rows, width, height){
      var frameDivs = [];
      
      for (var i = 0 ; i < rows; i ++){
          frameDivs.push(
              <img
                id={i+""}
                src=""
                key={i}
                style={{height:height, background_color:"blue",
                width:width, position:"relative"}}>
            </img>
          )
      }
      
      return frameDivs;
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
            </div>          
          
          ) ;
        
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
  frames:PropTypes.array.isRequired,
  colorRange:PropTypes.array.isRequired
}

module.exports = HeatmapUI;
