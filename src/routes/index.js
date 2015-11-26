import React from 'react';
import { Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
import App from '../containers/App';
import VenueContainer from '../containers/VenueContainer';

export default (
  <Route path="/" component={App}>
    <Route path=":name" component={VenueContainer} />
  </Route>
);
