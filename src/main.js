// require('es6-object-assign').polyfill()
// require('./stylus/main.styl')

// import DOMReady from 'detect-dom-ready'
// import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'

// Conditionally requiring store dependant on env. __PRODUCTION__ variable
// defined in webpack conf.

// Using require instead of import below so that minifying
// extracts dead code correctly.

let store = null
if (__PRODUCTION__) {
  store = require('./store/configureStore.prod')();
} else {
  store = require('./store/configureStore.dev')();
  // Create seperate dev tool window rather than docked.
  require('./createDevToolsWindow')(store);
}

class Root extends Component {
  render() {
    const rootStyle = {
      height: '100%'
    }
    return (
      <div style={rootStyle} >
        <Provider store={store}>
          <ReduxRouter />
        </Provider>
      </div>
    )
  }
}

export default <Root />