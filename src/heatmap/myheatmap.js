/* A wrapper class for the Plotly chart 'heatmapgl'.
Based off of the animation examples from the plotly.js websites
*/
import { axisTemplate, updatemenus, layout, trace } from './myheatmap.constants.js';
//import './plotly-latest.min.js';
//import './jquery-3.1.1.min.js';
var Plotly = require('plotly.js');



export default class MyHeatmap{
    
    constructor( div, height, width ){
        
                
        /* Bind functions which will be accessed outside of variable */
        this.initHeatmap = this.initHeatmap.bind( this )
        this.addFrames = this.addFrames.bind( this )
        this.play = this.play.bind( this )
        this.playFrame = this.playFrame.bind( this )
        this.resize = this.resize.bind( this )


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
        //layout.height = height;
        layout.height = height;
        layout.width = width;
        
        
    }
    
    /* Initially plot the map with one frame of data */
    initHeatmap( data ){
        const {ratio, frameData, x, y} = data

        
        console.log( "init heatmap on " + this.div )
            
        /* Initial data Data */
        trace[0].z=frameData;


        
        //set the width
        console.log( "ratio: " + ratio)
        //layout.width = (ratio * layout.height) + trace[0].colorbar.thickness + trace[0].colorbar.xpad;
        this.ratio = ratio;
        
        layout.margin = {
                t: 0,
                r: 0 * ratio,
                b: 0,
                l: 0 * ratio,
        }
        
        /* Initinally plot an empty heatmap */
        Plotly.plot(this.div, trace, layout,  {scrollZoom: false, staticPlot:false, displayModeBar: false, showLink:false});
        
        Plotly.relayout( this.div, layout )
        
        
        var div = document.getElementById( this.div )
        //window.onresize = function() {
            //Plotly.Plots.resize( div );
        //};
        
        /* Bind the event listeners */
        this.bindEventListeners();
        
        this.plotted = true;
        
    }
    
    resize( width, height ){

        layout.height = height;
        layout.width = width;
        if (this.plotted) Plotly.relayout( this.div, layout )
    } 
    /* Play through the frames or stop animating depending on whether already playing*/
    play( isPaused ){
        if ( isPaused ) {
            /* Begin with initial animation */
            Plotly.animate(this.div, null, updatemenus[0]['buttons'][0]['args'][1]);
        } else {
            Plotly.animate(this.div, [], updatemenus[0]['buttons'][0]['args'][1]);

        }
    }
    
    playFrame( frame ){
        
        Plotly.animate(this.div, [frame], updatemenus[0]['buttons'][0]['args'][1]);
    }
        
    /* Add frames to the plot and animate */
    addFrames( frames ){ 
        //console.log( Object.keys( json.frames ) )
                    
        /* Make the frames to animate */        
        var processedFrames = [];
        
        Object.keys( frames ).map( function( key, index ){
            
            processedFrames.push( {
                name: "" + key,
                data: [{
                    z: frames[key],
                }],
                traces: [0],
            } );
        });
        
        /* Add and animate frames */
        Plotly.addFrames( this.div, processedFrames );
        this.play();
             
    }
    
    /* Bind plotly event listeners*/
    bindEventListeners(){
        
        function stringify( obj ){
            var props = "{"
            if (obj !== null) { 
                for (var propertyname in obj) {
                    props = props + propertyname + ", ";
                }
            }

            return props + "}"         
        }
        
        var myPlot = document.getElementById( this.div )
        var plotData = myPlot.data;
        console.log( stringify( myPlot.data ) );
        
        myPlot.on('plotly_restyle', function(){
            console.log("restyle");
        });
        
        myPlot.on('plotly_relayout', function(data){
            console.log("relayout traces:" );
        });
        
        /* No data provided */
        myPlot.on('plotly_animated', function(  data ){           
            console.log("animated " + stringify( plotData ));
            
        });
        
        myPlot.on('plotly_redraw', function(){
            console.log("redraw");
        });
        
        myPlot.on('plotly_afterplot', function(){
            console.log("afterplot");
        });
    }
    
    
}
