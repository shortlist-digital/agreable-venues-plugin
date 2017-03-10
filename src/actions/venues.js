import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';
import { panToLocation } from '../actions/map';
import 'es6-promise/auto';

// to bin
import firebase from 'firebase';
import GeoFire from 'geofire';
import RSVP from 'rsvp';


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
    let distanceInMeters = Math.floor(distance * 1600);
    
    // inform we've started a new request
    dispatch(requestVenues);

    fetch(kitchin.url + 'brand/' + kitchin.brand + '/venues?lat=' + mapCenter.lat + '&lng=' + mapCenter.lng + '&radius=' + distanceInMeters)
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
    const firebaseReducer = state.app.firebaseReducer

    // // Conditionally initialise firebase.
    // if (!firebaseReducer.isInitialized) {
    //   initialiseFirebase(firebase, dispatch)
    // }

    // Check conditions under which we should fetch.
    if (shouldFetchVenues(state)) {
      return dispatch(fetchVenues(mapCenter, distance))
    }
  }
}

function fetchSingleVenue(name) {

  return function(dispatch, getState){
    // Inform app state that we've started a request.
    dispatch(requestVenues())

    firebase.database().ref('venues/' + name).once('value', function(snapshot) {
      dispatch(receiveVenues([snapshot.val()]))
      dispatch(requestSingleVenue(name))
    });

  }
}

function setVenueActive(venue){
  return {
    type: types.SET_VENUE_ACTIVE,
    venue
  }
}

export function requestSingleVenue(name) {

  return (dispatch, getState) => {

    const state = getState()
    const items = state.app.venues.items
    const firebaseReducer = state.app.firebaseReducer
    const activeVenue = {}

    // Conditionally initialise firebase.
    if (!firebaseReducer.isInitialized) {
      initialiseFirebase(firebase, dispatch)
    }

    if (items.has(name)) {
      let activeVenue = items.get(name)

      dispatch(fetchClosestVenues(activeVenue.location, activeVenue, 'venue-overlay'));
      dispatch(setVenueActive(activeVenue))
    } else {
      dispatch(fetchSingleVenue(name))
    }
  }

}

export function fetchClosestVenues(mapCenter, venues, type = 'search') {

  return function(dispatch, getState) {

    // Inform app state that we've started a request.
    if (type === 'search') {
      dispatch(requestClosestVenuesSearch())
    } else {
      dispatch(requestClosestVenues())
    }

    const state = getState();
    const geoFire = new GeoFire(firebase.database().ref('venues').child('_geofire'));
    let geoQuery = geoFire.query({
      center: [mapCenter.lat, mapCenter.lng],
      radius: 2
    });
    let receivedVenues = [];

    let onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, location, distance) {
      receivedVenues.push({
        key: key,
        location: location,
        distance: distance
      });
    });

    let receivedVenuesFull = [];
    let onReadyRegistration = geoQuery.on('ready', function() {
      onKeyEnteredRegistration.cancel();

      var promises = receivedVenues.map(function(item, index) {
        return firebase.database().ref('venues/' + receivedVenues[index].key).once('value', function(snapshot) {
          let brands = window.__INITIAL_STATE__.app.firebase.brands;
          let venue = snapshot.val();

          if (!venue) {
            return;
          }

          // make sure venue exists - there one item that returns null
          venue.distance = receivedVenues[index].distance;

          // if there are brand filters applied
          if (brands.length > 0) {
            // if the venues contains a brand in the brands filter
            if (filterByBrand(brands, venue.brands)) {
              // add the venue
              receivedVenuesFull.push(venue);
            }
          } else {
            // no filter, add all venues
            receivedVenuesFull.push(venue);
          }
        });
      });

      // once all promises have been settled
      RSVP.all(promises).then(function() {
        // dispatch events
        if (type === 'venue-overlay') {
          dispatch(receiveClosestVenues(receivedVenuesFull));
        } else {
          dispatch(receiveClosestVenuesSearch(receivedVenuesFull));
        }

        // the it's a single search
        if (type === 'venue-overlay') {
          dispatch(panToLocation(venues.location), type)
          dispatch(receiveVenues([venues]))
        }
      });
    });
  }
}

export function setVenueInactive(){
  return {
    type: types.SET_VENUE_INACTIVE
  }
}
