import thunkMiddleware from 'redux-thunk';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { routerStateReducer, reduxReactRouter } from 'redux-router'
import { createHistory, useBasename } from 'history'
import { devTools } from 'redux-devtools'
import createLogger from 'redux-logger';

import routes from '../routes'
import app from '../reducers'

const reducer = combineReducers({
  router: routerStateReducer,
  app
})

const paths = window.location.pathname.split('/')
const history = useBasename(createHistory)({basename:`/${paths[1]}`})

const finalCreateStore = compose(
  applyMiddleware(createLogger(), thunkMiddleware),
  reduxReactRouter({ routes, history }),
  devTools()
)(createStore)

export default function configureStore() {
  // Grab the state from a global injected on the server.
  const initialState = window.__INITIAL_STATE__;
  const store = finalCreateStore(reducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

