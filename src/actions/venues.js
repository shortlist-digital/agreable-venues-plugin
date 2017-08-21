import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';
import { panToLocation } from '../actions/map';
import 'es6-promise/auto';

function getQuery(key) {
   const query = window.location.search.substring(1)
   return query
     .split('&')
     .reduce((prev, curr, i) => {
       const query = curr.split('=')
       if (query[0] === key) prev = query[1]
       return prev
     }, '')
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

function requestClosestVenues() {
  return {
    type: types.REQUEST_CLOSEST_VENUES,
    isFetching: true,
  }
}

function receiveClosestVenues(data) {
  return {
    type: types.RECEIVE_CLOSEST_VENUES,
    items: data,
    receivedAt: Date.now(),
    isFetching: false
  }
}

function requestClosestVenuesSearch() {
  return {
    type: types.REQUEST_CLOSEST_VENUES_SEARCH,
    isSearching: true,
  }
}

function receiveClosestVenuesSearch(data) {
  return {
    type: types.RECEIVE_CLOSEST_VENUES_SEARCH,
    items: data,
    receivedAt: Date.now(),
    isSearching: false
  }
}

function requestClosestVenuesFailure(center) {
  return {
    type: types.REQUEST_CLOSEST_VENUES_FAILURE,
    center
  }
}

function fetchVenues(mapCenter, distance) {

  return function(dispatch, getState) {

    const kitchin = window.__INITIAL_STATE__.app.kitchin;

    // convert distance from miles to metres
    // (miles * 1.6) * 1000 = m = miles * 1600
    const distanceInMeters = Math.floor(distance * 1600);
    const tagQuery = getQuery('tag');
    const tags = tagQuery ? `&tags[]=${tagQuery}` : '';

    // inform we've started a new request
    dispatch(requestVenues);

    fetch(`${kitchin.url}api/v1/brand/${kitchin.brand}/venues?lat=${mapCenter.lat}&lng=${mapCenter.lng}&radius=${distanceInMeters}${tags}`)
      .then(function(response) {
          if (response.status >= 400) {
              throw new Error("Bad response from server");
          }

          return response.json();
      })
      .then(function(json) {
        dispatch(receiveVenues(json));
      })
    ;

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

export function fetchVenuesIfNeeded(mapCenter, distance) {
  return (dispatch, getState) => {

    const state = getState()

    // Check conditions under which we should fetch.
    if (shouldFetchVenues(state)) {
      return dispatch(fetchVenues(mapCenter, distance))
    }
  }
}

function fetchSingleVenue(slug) {

  return function(dispatch, getState) {
    // Inform app state that we've started a request.
    dispatch(requestVenues())

    const kitchin = window.__INITIAL_STATE__.app.kitchin;

    fetch(kitchin.url + 'api/v1/venue/?slug=' + slug)
      .then(function(response) {
          if (response.status >= 400) {
              throw new Error("Bad response from server");
          }

          return response.json();
      })
      .then(function(json) {
          dispatch(receiveVenues([json]))
          dispatch(setVenueActive(json))
          dispatch(fetchClosestVenues(json, json, 'venue-overlay'));
      })
    ;

  }
}

function setVenueActive(venue){
  return {
    type: types.SET_VENUE_ACTIVE,
    venue
  }
}

export function requestSingleVenue(slug) {

  return (dispatch, getState) => {

    dispatch(fetchSingleVenue(slug))

  }

}

export function fetchClosestVenues(mapCenter, venues, type = 'search') {

  return function(dispatch, getState) {

    // Inform app state that we've started a request.
    if (type === 'search') {
      dispatch(requestClosestVenuesSearch())
    } else {
      dispatch(requestClosestVenues())

      dispatch(panToLocation({lat: venues.lat, lng: venues.lng}), type)
    }

    const kitchin = window.__INITIAL_STATE__.app.kitchin;
    const tagQuery = getQuery('tag')
    const tags = tagQuery ? `&tags[]=${tagQuery}` : '';

    // 1 mile
    let distanceInMeters = 1600;

    fetch(kitchin.url + 'api/v1/brand/' + kitchin.brand + '/venues?lat=' + mapCenter.lat + '&lng=' + mapCenter.lng + '&radius=' + distanceInMeters + tags)
      .then(function(response) {
          if (response.status >= 400) {
              throw new Error("Bad response from server");
          }

          return response.json();
      })
      .then(function(json) {
        // dispatch events
        if (type === 'venue-overlay') {
          dispatch(receiveClosestVenues(json));
          dispatch(receiveVenues([venues]))
        } else {
          dispatch(receiveClosestVenuesSearch(json));
        }
      })
    ;
  }
}

export function setVenueInactive(){
  return {
    type: types.SET_VENUE_INACTIVE
  }
}
