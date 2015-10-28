import fetch from 'isomorphic-fetch'
import { Parse } from 'parse';

/*
 * Action types
 */
export const SEARCH_LOCATION = 'SEARCH_LOCATION'

// FIXME: No longer used.
export const UPDATE_MAP = 'UPDATE_MAP'

export const REQUEST_VENUES = 'REQUEST_VENUES'
export const RECEIVE_VENUES = 'RECEIVE_VENUES'
export const REQUEST_VENUES_FAILURE = 'REQUEST_VENUES_FAILURE'
export const INITIALIZE_PARSE = 'INITIALIZE_PARSE';

export const SHOW_VENUE = 'SHOW_VENUE'

/*
 * Action creators
 */
export function searchLocation(searchTerm) {
  return {
    type: SEARCH_LOCATION,
    searchTerm
  }
}

export function updateMap(bounds) {
  return {
    type: UPDATE_MAP,
    bounds
  }
}

function initializeParse() {
  return {
    type: INITIALIZE_PARSE
  }
}


function requestVenues(bounds) {
  return {
    type: REQUEST_VENUES,
    bounds
  }
}

function receiveVenues(bounds, data) {
  return {
    type: RECEIVE_VENUES,
    bounds: bounds,
    items: data,
    receivedAt: Date.now()
  }
}

function requestVenuesFailure(bounds) {
  return {
    type: REQUEST_VENUES_FAILURE,
    bounds
  }
}

function fetchVenues(bounds) {
  // Using Thunk middleware.
  return function(dispatch){
    // Inform app state that we've started a request.
    dispatch(requestVenues())

    const swBounds = bounds.getSouthWest()
    const neBounds = bounds.getNorthEast()
    const query = new Parse.Query("Venue")
    const sw = new Parse.GeoPoint(swBounds.lat, swBounds.lng)
    const ne = new Parse.GeoPoint(neBounds.lat, neBounds.lng)
    query.withinGeoBox("location", sw, ne).limit(5)

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
