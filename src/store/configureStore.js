import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { routerStateReducer, reduxReactRouter } from 'redux-router'
import { createHistory, useBasename } from 'history'
import { devTools } from 'redux-devtools'

import routes from '../routes'
import { app, map, venues } from '../reducers'

const reducer = combineReducers({
  router: routerStateReducer,
  app,
  map,
  venues
})

const paths = window.location.pathname.split('/')
const history = useBasename(createHistory)({basename:`/${paths[1]}`})

const finalCreateStore = compose(
  applyMiddleware(createLogger(), thunkMiddleware),
  reduxReactRouter({ routes, history }),
  devTools()
)(createStore)

export default function configureStore() {

  const store = finalCreateStore(reducer)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

