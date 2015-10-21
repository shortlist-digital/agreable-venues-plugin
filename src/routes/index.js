import React from 'react';
import { Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
import App from '../containers/App';
import Venue from '../components/Venue';

export default (
  <Route path="/" component={App}>
    <Route path=":name" component={Venue} />
  </Route>
);
