import DOMReady from 'detect-dom-ready'
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';

import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter
} from 'redux-router';

import { Route, Link } from 'react-router';
import { Provider, connect } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { createHistory, useBasename } from 'history';

@connect(state => ({ routerState: state.router }))
class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const links = [
      '/',
      '/a-venue',
    ].map(l =>
      <p>
        <Link to={l}>{l}</Link>
      </p>
    );

    return (
      <div>
        <h1>Venues</h1>
        {links}
        {this.props.children}
      </div>
    );
  }
}

class Venue extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <h2>Venue {this.props.params.name}</h2>
      </div>
    );
  }
}

const reducer = combineReducers({
  router: routerStateReducer
});

const paths = window.location.pathname.split('/');
const history = useBasename(createHistory)({basename:`/${paths[1]}`});

const store = compose(
  reduxReactRouter({ history }),
  devTools()
)(createStore)(reducer);

class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path="/" component={App}>
              <Route path=":name" component={Venue} />
            </Route>
          </ReduxRouter>
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
