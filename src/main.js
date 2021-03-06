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
}

const Root = () =>
  <div style={{ height: '100%' }}>
    <Provider store={store}>
      <ReduxRouter />
    </Provider>
  </div>

if (!__PRODUCTION__) {
const DOMReady = require('detect-dom-ready')
const ReactDOM = require('react-dom')
  DOMReady(function() {
    ReactDOM.render(<Root />, document.getElementById('agreable-venues'))
  })
}

export default Root
