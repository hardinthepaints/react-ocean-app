import { combineReducers } from 'redux';

import {
    REQUEST_DATA,
    RECEIVE_DATA,
    PLAYPAUSE_PRESS,
    SCRUBBER,
    RANGE,
    SPEED_SLIDER,
    SET_CURRENT,
    INIT_HEATMAP,
    MAP_CONTAINER_RESIZE
} from './actions'

import MyHeatmap from './heatmap/myheatmap'



function getCorrectFrame( frame, range ){
    frame = Math.max( frame, range[0] );
    frame = Math.min( frame, range[1]);
    return frame;
    
}



function currentFrame( state, action ){
    
    switch (action.type) {
        case RANGE:
            console.log("action.range[0]: " + action.range[0])
            return getCorrectFrame( state.currentFrame, action.range );
        
        case SCRUBBER:
            return getCorrectFrame( action.frame, state.range );

        case SET_CURRENT:
            return getCorrectFrame( action.frame, state.range );
        
        default:
            return state.currentFrame;
    }
}

function animationRequestID( animationRequestID=null, action ){
    switch (action.type){
        case SET_CURRENT:
            return action.animationRequestID;
        default:
            return animationRequestID;
    }
    
}

function isPlaying( isPlaying = false, action ){
        
    switch (action.type){
        case PLAYPAUSE_PRESS:
            return !isPlaying
        case SCRUBBER:            
            return false
        default:
            return isPlaying
        
    }
}

function frame( state = { isFetching:false, data:[] }, action ){
    
    switch (action.type){
        case REQUEST_DATA:
            return Object.assign({}, state, { isFetching:true } )
        case RECEIVE_DATA:       
            
            return Object.assign({}, state,
                {
                   isFetching:false,
                   data:action.frameData,
                   x:action.x,
                   y:action.y,
                   frameCount:action.frameCount,
               })
        default:
            return state
        
    }
}

function frames( state = {}, action ){
    
    switch (action.type){
        case REQUEST_DATA:
        case RECEIVE_DATA:

            return Object.assign({}, state, {
                [action.frame] : frame( state[action.frame], action )
            } )
        default:
            return state
        
    }
}

function range( state = [0,100], action){
    switch(action.type){
        case RANGE:
            return action.range
        case SCRUBBER:
            return [Math.min(state[0], action.frame), Math.max(state[1], action.frame)]
        case RECEIVE_DATA:
            if(action.frameCount){
                return [ state[0], action.frameCount -1 ];
            }

        default:
            return state;
    }
}

function speed( state = 5, action){
    switch(action.type){
        case SPEED_SLIDER:
            return action.speed;
        default:
            return state;
    }
}

function heatmap( state=null, action){
    switch(action.type){
        case INIT_HEATMAP:
            return new MyHeatmap( action.divname, action.height, action.width );
            
            return state
        case SET_CURRENT:
        case SCRUBBER:
            state.playFrame( action.frame );
            return state;
        case RECEIVE_DATA:
            
            //var newFrame = { [action.frame]:action.frameData, ratio:action.ratio };
            
            /* add data to heatmap */
            if(action.frame === 0) state.initHeatmap( action );
            else state.addFrames( {[action.frame]:action.frameData} )
            return state;
        default:
            return state;
    }
}


function ui(state={currentFrame:0, isPlaying:true, speed:50, range:[0,50]}, action){    
    
    return {
        currentFrame:currentFrame( state, action ),
        range:range(state.range, action),
        speed:speed(state.speed, action),
        isPlaying:isPlaying(state.isPlaying, action),
        animationRequestID:animationRequestID(state.animationRequestID, action)
    }
    
}

const rootReducer = combineReducers({
    ui,
    frames,
    heatmap,
})

export default rootReducer;
