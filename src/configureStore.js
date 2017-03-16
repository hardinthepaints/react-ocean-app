import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleWare = createLogger();

const preLoadedState = {
    ui : {
        isPlaying:false,
        currentFrame:0,
        speed:30,
        range:[0,100],
        animationRequestID:null
    },
    
    frames:{
        0:{
            data:null,
            isFetching:false,
            frameCount:10,
        }
    },
    heatmap:null,
}

export default function configureStore( preloadedState=preLoadedState ){
    
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleWare
        )
    )
}