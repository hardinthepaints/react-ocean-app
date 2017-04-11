/* A wrapper class for the Plotly chart 'heatmapgl'.
Based off of the animation examples from the plotly.js websites
*/
import { axisTemplate, updatemenus, layout, trace } from './myheatmap.constants.js';
//import './plotly-latest.min.js';
//import './jquery-3.1.1.min.js';
var Plotly = require('plotly.js');



export default class MyHeatmap{
    
    constructor( div, json, width, height ){
        
        /* Bind functions which will be accessed outside of variable */
        this.initHeatmap = this.initHeatmap.bind( this )
        this.playFrames = this.playFrames.bind( this )


        /* define sliders */    
        this.sliders = [{
            pad: {t: 30},
            currentvalue: {
                xanchor: 'right', prefix: 'frame: ',font: {color: '#888',size: 20}
            },
            
        }];
    
        /* The id of the div which will contain the heatmap */
        this.div = div;
        this.plotted = false;
        this.ratio = 1;
        this.trace = trace[0]
        
        /* set the height */
        layout.height = height;
        layout.width = width;
        
        this.initHeatmap(json);
        //this.addFrames(json);
        
    }
    
    //play( frames ){
    //    
    //    frames = Array.apply(null, Array(10000)).map(function (_, i) {return i % frames.length ;});
    //    
    //    this.addFrames(frames)
    //    //Plotly.animate(this.div, [], {mode: 'next'});
    //    /* Begin with initial animation */
    //    
    //    var settings =  updatemenus[0]['buttons'][0]['args'][1]
    //    Plotly.animate(this.div, frames, settings);
    //  
    //}
    //
    //pause(){
    //    Plotly.animate(this.div, [], settings);
    //}
    /* Initially plot the map with one frame of data */
    initHeatmap( json ){
        
        console.time("initHeatmap")
        var z = json[0].z;
        
        /* Initial data Data */
        var trace = [
            {
                z: z,
                /* x: json.lonp,
                y: json.latp, */
                /*hoverinfo:"z+text",  */          
                type: 'heatmapgl',
                colorscale: 'Jet',
                opacity: 1.0,
                reversescale: false,
                name:'trace0',
                connectgaps: false,
                /* zauto:true,*/
                zmin:0,
                zmax:33,
            }
        ];
        
        /* set the width */
        /* layout.width = json.ratio * layout.height;
        layout.margin = {
                t: 100,
                r: 100 * json.ratio,
                b: 100,
                l: 100 * json.ratio,
        } */
        
        /* Initinally plot an empty heatmap */
        Plotly.plot(this.div, trace, layout,  {scrollZoom: false, staticPlot:true, displayModeBar:false, showLink:false});
    }
        
    playFrames( json ){
                
        /* Make the frames to animate */        
        var processedFrames = [];
        
        const formatFrame = this.formatFrame;
        
        //Object.keys( json.frames ).map( function( key, index ){
        json.map( function( frame, key ){
          
            processedFrames.push( formatFrame(frame, key) );
        });
        
        Plotly.animate(this.div, processedFrames, updatemenus[0]['buttons'][0]['args'][1]);
    }
    
    //playFrame(frame){
    //    Plotly.animate(this.div, [frame], updatemenus[0]['buttons'][0]['args'][1]);
    //}
    
    addFrames( json ) {
        /* Make the frames to animate */        
        var processedFrames = [];
        
        const formatFrame = this.formatFrame;
        
        //Object.keys( json.frames ).map( function( key, index ){
        json.map( function( frame, key ){
          
            processedFrames.push( formatFrame(frame, key) );
        });
        
        Plotly.addFrames(this.div, processedFrames)
    }
    
    /* Format frame data from the server so plotly can interpret */
    formatFrame( frame, key ){
            return {
                name: "" + key,
                data: [{
                    z: frame.z,
                }],
                traces: [0],
            };       
        
    }
}
