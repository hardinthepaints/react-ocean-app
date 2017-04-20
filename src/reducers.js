import { combineReducers } from 'redux';

import {

    PLAYPAUSE_PRESS,
    SCRUBBER,
    RANGE,
    SPEED_SLIDER,
    SET_CURRENT,
    RECEIVE_DATA,
    MODE_TOGGLE
    //REQUEST_DATA, 
} from './actions'

function getCorrectFrame( frame, range ){
    frame = Math.max( frame, range[0] );
    frame = Math.min( frame, range[1]);
    return frame;
    
}

function currentFrame( state, action ){
    
    switch (action.type) {
        case RANGE:
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
            return false;
        case RECEIVE_DATA:
            return true;
        default:
            return isPlaying
    }
}

function frames( state = [], action ){
    /* action = {hours, date}*/
    switch (action.type){
        case RECEIVE_DATA:
            return action.json;
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
            return [ state[0], action.json.length -1 ];
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

function mapIsOn(state, action ){
    switch(action.type){
        case MODE_TOGGLE:
            return !state;
        default:
            return state;
    }
}

function ui(state={currentFrame:3, isPlaying:false, speed:50, range:[0,50], mapIsOn:false}, action ){    
    
    return {
        currentFrame:currentFrame( state, action ),
        range:range(state.range, action),
        speed:speed(state.speed, action),
        isPlaying:isPlaying(state.isPlaying, action),
        animationRequestID:animationRequestID(state.animationRequestID, action),
        mapIsOn:mapIsOn(state.mapIsOn, action)
        
    }
    
}

const rootReducer = combineReducers({
    ui,
    frames,
})

export default rootReducer;
