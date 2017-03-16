import fetch from 'isomorphic-fetch'

/*
 *Actions
 */ 

export const REQUEST_DATA = "REQUEST_DATA";
export const SET_CURRENT = "SET_CURRENT";
export const RECEIVE_DATA = "RECEIVE_DATA";
export const PLAYPAUSE_PRESS = "PLAYPAUSE_PRESS";
export const SCRUBBER = "SCRUBBER";
export const RANGE = "RANGE"
export const SPEED_SLIDER = "SPEED_SLIDER"
export const INIT_HEATMAP = "INIT_HEATMAP"
export const MAP_CONTAINER_RESIZE = "MAP_CONTAINER_RESIZE"



/*
 *Action creators
 */

export function requestData( frame ){
    return {
        type : REQUEST_DATA,
        frame:frame
    }
}

/* Async action creators */

export function receiveData( frame, json ){
    if ( frame === 0) {
        return {
            type : RECEIVE_DATA,
            frameData : json.frames[frame],
            x : json.x,
            y : json.y,
            frame : frame,
            frameCount:json.frameCount,
            ratio:json.ratio
        }        
    } else {
        return {
            type : RECEIVE_DATA,
            frameData : json.frames[frame],
            frame : frame
        } 
    }
}

function fetchData( frame ){
    return dispatch => {
        dispatch( requestData(frame) );
        const url = "http://localhost:5000/frames?frame=" + frame
        return fetch( url )
            .then( response => response.json() )
            .then(json => dispatch( receiveData(frame, json)))
        
    }
}

function shouldFetchData( state, frame ){
    const data = state.frames[ frame ];
    
    if ( !data || data == null ) {
        return true;
    } else if ( data.isFetching ) {
        return false;
    } else if ( !data.data ) {
        return true;
    }
}

export function fetchDataIfNeeded( frame ) {
        
    return (dispatch, getState) => {
        if (shouldFetchData(getState(), frame)) {
            return dispatch( fetchData(frame) )
        }
        
    }
}

/* Synchronous action creators */

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
    }
}

export function speedSlider( speed ){
    return {
        type : SPEED_SLIDER,
        speed : speed
    }
}

export function initHeatmap( divname, height, width ){
    return {
        type: INIT_HEATMAP,
        height:height,
        width:width,
        divname:divname
    }
}

export function mapContainerResize( width, height ) {
    return {
        type : MAP_CONTAINER_RESIZE,
        width:width,
        height:height
    }
}

