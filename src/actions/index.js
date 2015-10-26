import fetch from 'isomorphic-fetch'

/*
 * Action types
 */
export const SEARCH_LOCATION = 'SEARCH_LOCATION'

// FIXME: No longer used.
export const UPDATE_MAP = 'UPDATE_MAP'

export const REQUEST_VENUES = 'REQUEST_VENUES'
export const RECEIVE_VENUES = 'RECEIVE_VENUES'
export const REQUEST_VENUES_FAILURE = 'REQUEST_VENUES_FAILURE'

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

function requestVenues(bounds) {
  return {
    type: REQUEST_VENUES,
    bounds
  }
}

function receiveVenues(bounds, json) {
  return {
    type: RECEIVE_VENUES,
    bounds: bounds,
    items: json,
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

    return fetch('http://httpbin.org/delay/1')
      .then(response => response.json())
      .then(json => {
        dispatch(receiveVenues(bounds, json))
      })
      .catch(function(ex) {
        dispatch(requestVenuesError(bounds, json))
        console.log('parsing failed', ex)
      })
      // TODO: Catch errors.
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
    if (shouldFetchVenues(getState(), bounds)) {
      return dispatch(fetchVenues(bounds))
    }
  }
}
