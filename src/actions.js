import fetch from 'isomorphic-fetch'

/*
 *Actions
 */ 

export const REQUEST_DATA = "REQUEST_DATA";
export const RECEIVE_DATA = "RECEIVE_DATA";
export const RECEIVE_FAILURE = "RECEIVE_FAILURE"
export const SET_CURRENT = "SET_CURRENT";
export const PLAYPAUSE_PRESS = "PLAYPAUSE_PRESS";
export const SCRUBBER = "SCRUBBER";
export const RANGE = "RANGE"
export const SPEED_SLIDER = "SPEED_SLIDER"
export const MODE_TOGGLE = "MODE_TOGGLE"
export const COLOR_RANGE = "COLOR_RANGE"
export const ARROW = "ARROW"



/* Async action creators */

function checkStatus(response){
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;  
}

function fetchData(url = "http://localhost:5000/oceanapp/v1.0/jsonsql?precomp=true", username="xman", password="el33tnoob" ){
    
    const init ={
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
    }
   
    
    return dispatch => {
        dispatch( requestData() );
        return fetch( url, init )
            .then(checkStatus)
            .then( response => response.json() )
            .then(json => dispatch( receiveData(json)))
            /* .catch((err) => dispatch( receiveFailure()) ); */
        
    }
}

function receiveFailure(){    
    return {
        type:RECEIVE_FAILURE
    }
}

function shouldFetchData(frames){
    return frames === null || frames.length ===0
}


/* Synchronous action creators */
export function fetchDataIfNeeded() {
   
    return (dispatch, getState) => {
        
        if (shouldFetchData(getState().frames)) {
            return dispatch( fetchData() )
        }
                
    }
}

export function requestData(){
    return {
        type : REQUEST_DATA,
    }
}

export function receiveData(json){
    return {
        json : json,
        type : RECEIVE_DATA,
    }
}

export function playPausePress(){
    return {
        type : PLAYPAUSE_PRESS,
    }
}

export function setCurrentFrame( frame, animationRequestID = null ){
    return {
        type : SET_CURRENT,
        animationRequestID : animationRequestID,
        frame : frame,   
    }
}

export function scrubber( frame ){ 
    return {
        type : SCRUBBER,
        frame : frame,
    }
}

export function range( range ){
        
    return {
        type : RANGE,
        range : range,
        allowedFrames:Array.apply(null, Array(range[1] - range[0] + 1)).map(function (_, i) {return i + range[0];})
    }
}

export function speedSlider( speed ){
    return {
        type : SPEED_SLIDER,
        speed : speed
    }
}

export function modeToggle(){
    return {
        type : MODE_TOGGLE,
    }
}

export function colorRange(range){
    return {
        type:COLOR_RANGE,
        range:range
    }
}

export function arrow(frame){
    return {
        type : ARROW,
        frame:frame
    }
}
