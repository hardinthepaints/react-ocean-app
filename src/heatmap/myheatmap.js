/* A wrapper class for the Plotly chart 'heatmapgl'.
Based off of the animation examples from the plotly.js websites
*/

import heatmapConstants from './myheatmap.constants.json'
const {layout, trace, animationAttribs, altcolorscale } = heatmapConstants

var Plotly = require('plotly.js');

export default class MyHeatmap{
    
    constructor( div, json, width, height, svgCallBack ){
                        
        /* Bind functions which will be accessed outside of variable */
        this.initHeatmap = this.initHeatmap.bind( this );
        this.playFrame = this.playFrame.bind( this );
        this.getImage = this.getImage.bind(this);
        this.changeColorRange = this.changeColorRange.bind(this);
        this.purge = this.purge.bind(this)
    
        /* The id of the div which will contain the heatmap */
        this.div = div;
        
        /* set the height */
        layout.height = height;
        layout.width = width;
        
        /* Initialize the heatmap and add frames*/
        this.initHeatmap(json);
        this.addFrames(json);
        
        this.savedFrames = {}
        
        this.svgCallBack = svgCallBack;
                
    }

    /* Initially plot the map with one frame of data */
    initHeatmap( json ){
        
        console.time("initHeatmap")
        var z = json[0].z;
                
        var myTrace = [Object.assign({}, trace[0], {z:z, visible:true}), Object.assign({}, trace[0], {z:z, visible:true, colorscale:altcolorscale, showscale:false})]
        var myLayout = Object.assign({}, layout)
        
        /* Initinally plot an empty heatmap */
        Plotly.plot(this.div, myTrace, myLayout,  {scrollZoom: false, staticPlot:false, displayModeBar:false, showLink:false}).catch(function(e){
            console.log(e);
        });
    }
    
    /* Convert plot to svg and return svg to given callback function */
    getImage( svgCallBack, currentFrame ){
        const {div, savedFrames} = this;
        const graphDiv = document.getElementById( div )
        Plotly.toImage(graphDiv, {format:"png"}).then(
            (url) => {
                svgCallBack(url, currentFrame);
                }   
                                                      
        ).catch((err) => console.log(err));

    }
    
    changeColorRange(colorRange){
        //var update = {
        //    
        //    data: [{
        //        zmin:colorRange[0],
        //        zmax:colorRange[1]
        //    }],
        //    traces:[0]
        //
        //
        //}
        //
        //Plotly.animate( this.div, update, animationAttribs )
        
        Plotly.restyle(this.div, {zmin:colorRange[0],zmax:colorRange[1]}, 0);

    }
    
    
    /* Play a frame referenced by the given frame number */
    playFrame(frame, colorRange=null, frames=null){
        const {div} = this;
        //const graphDiv = document.getElementById( div )
        
        if ( !colorRange ) {
            Plotly.animate(div, [frame], animationAttribs).then(() => {
                //this.getImage(this.svgCallBack, frame)
            })
        } else {
            var myframe = {
                name:frame+"",
                data:[{
                    z:frames[frame].z,
                    zmin:colorRange[0],
                    zmax:colorRange[1]
                }],
                traces:[0]

            }
            Plotly.animate(div, [myframe], animationAttribs).then(() => {})
            
            //console.log( myframe.data[0] )
            //myframe.data[0].z = frames[frame].z 
            //Plotly.restyle(div, myframe.data[0], 0)
        }

                
    }
    
    purge(){
        Plotly.purge(this.div)
    }
    
    /* Add the frames using plotly's addFrames method */
    addFrames( json ) {
        /* Make the frames to animate */        
        var processedFrames = [];
        
        const formatFrame = this.formatFrame;
        
        //Object.keys( json.frames ).map( function( key, index ){
        json.map( function( frame, key ){
          
            processedFrames.push( formatFrame(frame, key) );
        });
        
        Plotly.addFrames(this.div, processedFrames).catch(function(e){
            console.log(e);
        });
    }

    /* Format frame data from the server so plotly can interpret */
    formatFrame( frame, key ){
            return {
                name: "" + key,
                data: [{
                    z: frame.z,
                }],
                traces:[0]
            };       
        
    }
    
    /* deprecated loop all the frames using plotly's animation */
    play( frames ){
        
        frames = Array.apply(null, Array(10000)).map(function (_, i) {return i % frames.length ;});

        Plotly.animate(this.div, frames, animationAttribs).catch(function(err){
            console.log(err);
        });
      
    }
}
