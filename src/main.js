import React from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'

// Conditionally requiring store dependant on env. __PRODUCTION__ variable
// defined in webpack conf.

// Using require instead of import below so that minifying
// extracts dead code correctly.

let store = null
if (__PRODUCTION__) {
  store = require('./store/configureStore.prod').default();
} else {
  store = require('./store/configureStore.dev').default();
  // Create seperate dev tool window rather than docked.
  require('./createDevToolsWindow').default(store);
}

const Root = () =>
  <div style={{ height: '100%' }}>
    <Provider store={store}>
      <ReduxRouter />
    </Provider>
  </div>

export default Root
