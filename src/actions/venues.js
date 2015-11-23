import fetch from 'isomorphic-fetch'
import { Parse } from 'parse';
import * as types from '../constants/ActionTypes';

function initializeParse() {
  return {
    type: types.INITIALIZE_PARSE
  }
}


function requestVenues(bounds) {
  return {
    type: types.REQUEST_VENUES,
    bounds
  }
}

function receiveVenues(bounds, data) {
  return {
    type: types.RECEIVE_VENUES,
    bounds: bounds,
    items: data,
    receivedAt: Date.now()
  }
}

function requestVenuesFailure(bounds) {
  return {
    type: types.REQUEST_VENUES_FAILURE,
    bounds
  }
}

function fetchVenues(bounds) {
  // Using Thunk middleware.
  return function(dispatch, getState){
    // Inform app state that we've started a request.
    dispatch(requestVenues())
    const items = getState().app.venues.items

    const swBounds = bounds.getSouthWest()
    const neBounds = bounds.getNorthEast()
    const query = new Parse.Query("Venue")
    const sw = new Parse.GeoPoint(swBounds.lat, swBounds.lng)
    const ne = new Parse.GeoPoint(neBounds.lat, neBounds.lng)
    query.withinGeoBox("location", sw, ne).limit(1000)

    // If we already have some venues then exclude them from
    // query to Parse.
    if(items.size > 0){
      query.notContainedIn('objectId', Array.from(items.keys()))
    }

    return query.find()
      .then(results => {
        dispatch(receiveVenues(bounds, results))
      }, ex => {
        dispatch(requestVenuesError(bounds))
        console.log('parsing failed', ex)
      })
  }
}

function shouldFetchVenues(state, bounds) {
  const venues = state.venues
  if (!venues) {
    return true
  }
  if (venues.isFetching) {
    return false
  }
  return true
}

export function fetchVenuesIfNeeded(bounds) {
  return (dispatch, getState) => {

    const state = getState()
    const parse = state.app.parse

    // If parse hasn't been initialized do so here.
    if(!parse.isInitialized){
      Parse.initialize(parse.parse_app_id, parse.parse_js_key);
      dispatch(initializeParse())
    }

    // Check conditions under which we should fetch.
    if (shouldFetchVenues(state, bounds)) {
      return dispatch(fetchVenues(bounds))
    }
  }
}