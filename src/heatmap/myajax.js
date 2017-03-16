
/* import jquery */
export var $ = require('jquery');


/* Download a range of data frames using an ajax jsonp request */
export function downloadJSONP( url, args ){
            
    /* args as they pertain to the server
     * 'end': the last frame to return, (not inclusive)
     * 'start': the first frame to return (inclusive)
     * 'first': Boolean whether or not this is the first call
     * 'callback': the string name of the javascript function to call when this request is answered
     * example: var args = { start : 0, end : 30, first : true, callback: 'handleJSON' }
            //request the first 30 frames, this is the first request, and callback to handleJSON()
     * 
    */
    
    /* Default args */
    var template = {callback:"hm.handleJSON", end:1, start:0};
    
    for (var attrname in args) { template[attrname] = args[attrname]; }
        
    var callback = template.callback;
    delete template.callback
    
    console.log( template )
            
    /* make asynchronous call */
    /* 'JSON Padded' Cross-origin Ajax request to the server */
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: template,
        jsonpCallback: callback,
    });
        
}

export function downloadData( url, args ){
    /* args as they pertain to the server
     * 'end': the last frame to return, (not inclusive)
     * 'start': the first frame to return (inclusive)
     * 'first': Boolean whether or not this is the first call
     * 'callback': the string name of the javascript function to call when this request is answered
     * example: var args = { start : 0, end : 30, first : true, callback: 'handleJSON' }
            //request the first 30 frames, this is the first request, and callback to handleJSON()
     * 
    */
    
    /* Default args */
    var template = {callback:"hm.handleJSON", end:1, start:0};
    
    for (var attrname in args) { template[attrname] = args[attrname]; }
        
    var callback = template.callback;
    delete template.callback
    
    console.log( template )
            
    /* make asynchronous call */
    /* 'JSON Padded' Cross-origin Ajax request to the server */
    $.ajax({
        url: url,
        dataType: "json",
        data: template,
        success: callback,
    });   
    
}