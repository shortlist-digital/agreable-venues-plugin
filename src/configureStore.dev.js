require('es6-object-assign').polyfill()
require('./stylus/main.styl')

import DOMReady from 'detect-dom-ready'
import ReactDOM from 'react-dom'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'
import React, { Component } from 'react'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'
import configureStore from './store/configureStore'

const store = configureStore()

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

DOMReady(function() {
  ReactDOM.render(<Root />, document.getElementById('agreable-venues'))
})

// Create seperate dev tool window rather than docked.
require('./createDevToolsWindow')(store);
