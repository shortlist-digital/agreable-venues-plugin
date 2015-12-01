import fetch from 'isomorphic-fetch'
import { Parse } from 'parse';
import * as types from '../constants/ActionTypes';
import { panToLocation } from '../actions/map';
import { getVenueQuery } from '../utils/ParseUtils';

function initializeParse() {
  return {
    type: types.INITIALIZE_PARSE
  }
}

function requestVenues() {
  return {
    type: types.REQUEST_VENUES
  }
}

function receiveVenues(data) {
  return {
    type: types.RECEIVE_VENUES,
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
  return function(dispatch, getState){
    // Inform app state that we've started a request.
    dispatch(requestVenues())
    const state = getState()
    const items = state.app.venues.items
    const parse = state.app.parse

    const swBounds = bounds.getSouthWest()
    const neBounds = bounds.getNorthEast()

    const query = getVenueQuery(parse)
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
        dispatch(receiveVenues(results))
      }, ex => {
        dispatch(requestVenuesError(bounds))
        console.log('parsing failed', ex)
      })
  }
}

function shouldFetchVenues(state) {
  const venues = state.venues
  if (!venues) {
    return true
  }
  if (venues.isFetching) {
    return false
  }
  return true
}

function initialiseParse(parse, dispatch){
  // If parse hasn't been initialized do so here.
  if(!parse.isInitialized){
    Parse.initialize(parse.parse_app_id, parse.parse_js_key);
    dispatch(initializeParse())
  }
}

export function fetchVenuesIfNeeded(bounds) {
  return (dispatch, getState) => {

    const state = getState()
    const parse = state.app.parse

    // Conditionally initialise parse.
    initialiseParse(parse, dispatch)

    // Check conditions under which we should fetch.
    if (shouldFetchVenues(state, bounds)) {
      return dispatch(fetchVenues(bounds))
    }
  }
}

function fetchSingleVenue(name){
  return function(dispatch, getState){
    // Inform app state that we've started a request.
    dispatch(requestVenues())

    const parse = getState().app.parse
    const query = getVenueQuery(parse)
    query.equalTo("slug", name);

    return query.find()
      .then(results => {
        dispatch(receiveVenues(results))
        dispatch(requestSingleVenue(name))
      }, ex => {
        dispatch(requestVenuesError(bounds))
        console.log('parsing failed', ex)
      })

  }
}

function setVenueActive(venue){
  return {
    type: types.SET_ACTIVE_VENUE,
    venue
  }
}

export function requestSingleVenue(name) {
  return (dispatch, getState) => {

    const state = getState()
    const items = state.app.venues.items
    const parse = state.app.parse
    const activeVenue = {}

    // Conditionally initialise parse.
    initialiseParse(parse, dispatch)

    if(items.has(name)){
      let activeVenue = items.get(name)
      dispatch(setVenueActive(activeVenue))
      dispatch(panToLocation(activeVenue.location))
    } else {
      dispatch(fetchSingleVenue(name))
    }
  }
}
