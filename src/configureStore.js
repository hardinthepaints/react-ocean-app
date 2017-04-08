import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleWare = createLogger();

export default function configureStore( preloadedState ){
    
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleWare
        )
    )
}