require('es6-object-assign').polyfill()
require('./stylus/main.styl')

import DOMReady from 'detect-dom-ready'
import ReactDOM from 'react-dom'
import { ReduxRouter } from 'redux-router';
import { Provider } from 'react-redux'
import React, { Component } from 'react'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'
import configureStore from './store/configureStore'

const store = configureStore()

class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter />
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    )
  }
}

DOMReady(function() {
  ReactDOM.render(<Root />, document.getElementById('venues-plugin'))
})
