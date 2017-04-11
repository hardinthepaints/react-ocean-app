/* Plotly axis style */
export const axisTemplate = {
    autorange: true,    
    type:"linear",
    showgrid: false,
    zeroline: false,
    gridwidth: 2,
    linecolor: 'black',
    showticklabels: true,
    ticks: '',
    title: 'latitude',
    fixedrange:true,
    visible:false,
    showlengend:false,
};

/* json data for the play and pause buttons */


export const updatemenus = [{
    "x": 0.1,
    "y": 0,
    "yanchor": "top",
    "xanchor": "center",
    "showactive": false,
    "direction": "right",
    "type": "buttons",
    "pad": {"t": 100, "r": 10},
    "buttons": [{
      "method": "animate",
      "args": [null, {
        /*"fromcurrent": true,*/
        /* "mode": "next", */
        "transition": {
          "duration": 0,
        },
        "frame": {
          "duration": 0,
          "redraw":false,
          "relayout":false,
        }
      }],
      "label": "Play"
    }, {
      "method": "animate",
      "args": [
        [null],
        {
          "mode": "immediate",
          "transition": {
            "duration": 0
          },
          "frame": {
            "duration": 0,
            "redraw": false,
            "relayout":false
          }
        }
      ],
      "label": "Pause"
    }]
}]

export var trace = [
    {
        z: null,
        /* x: data.x,
        y: data.y, */ 
        hoverinfo:"z+text",            
        type: 'heatmapgl',
        /* colorscale: 'Jet', */
        colorscale: [
            ['0.0', 'rgba(165,0,38,0)'],
            ['0.111111111111', 'rgb(215,48,39)'],
            ['0.222222222222', 'rgb(244,109,67)'],
            ['0.333333333333', 'rgb(253,174,97)'],
            ['0.444444444444', 'rgb(254,224,144)'],
            ['0.555555555556', 'rgb(224,243,248)'],
            ['0.666666666667', 'rgb(171,217,233)'],
            ['0.777777777778', 'rgb(116,173,209)'],
            ['0.888888888889', 'rgb(69,117,180)'],
            ['1.0', 'rgba(49,54,149,255)']
        ],
        /* showlegend: true, */
        visible:true,
        
        opacity: 1,
        reversescale: false,
        name:'trace0',
        connectgaps: false,
        zsmooth:"fast",
        showscale:true,
        colorbar:{
            xanchor: "left",
            yanchor:'center',
            xpad:0,
        }

    }
];
    
/* Layout of trace */
export const layout = {
    title: 'Salinity',
    autosize:false,
    margin: {
      t: 0,
      r: 0,
      b: 0,
      l: 0,
      autoexpand:false,
    },
    paper_bgcolor:'#7f7f7f',
    plot_bgcolor:'#c7c7c7',
    /* yaxis: axisTemplate,
    xaxis: Object.assign({}, axisTemplate, {title:'longitude'}), */
    
    dragmode: "select",
    /* make background transparent*/
    /* paper_bgcolor:'transparent',
    plot_bgcolor:'transparent', */
    /* xaxis:axisTemplate,
    yaxis:axisTemplate, */


};
