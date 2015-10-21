import DOMReady from 'detect-dom-ready'
import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import { createStore, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { ReduxRouter, routerStateReducer, reduxReactRouter } from 'redux-router';
import { createHistory, useBasename } from 'history';

import routes from './routes';
import venues from './reducers';

const reducer = combineReducers({
  router: routerStateReducer,
	venues
});

const paths = window.location.pathname.split('/');
const history = useBasename(createHistory)({basename:`/${paths[1]}`});

const store = compose(
  reduxReactRouter({ routes, history }),
  devTools()
)(createStore)(reducer);

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
    );
  }
}

DOMReady(function() {
  ReactDOM.render(<Root />, document.getElementById('venues-plugin'));
})
