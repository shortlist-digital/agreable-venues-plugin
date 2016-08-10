import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';
import { panToLocation } from '../actions/map';
import firebase from 'firebase';
import GeoFire from 'geofire';
import RSVP from 'rsvp';


function initializeFirebase() {
  return {
    type: types.INITIALIZE_FIREBASE
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

function requestClosestVenues() {
  return {
    type: types.REQUEST_CLOSEST_VENUES,
    isSearching: true,
  }
}

function receiveClosestVenues(data) {
  return {
    type: types.RECEIVE_CLOSEST_VENUES,
    items: data,
    receivedAt: Date.now(),
    isSearching: false,
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
    isSearching: false,
  }
}

function requestClosestVenuesFailure(center) {
  return {
    type: types.REQUEST_CLOSEST_VENUES_FAILURE,
    center
  }
}

function filterByBrand(brands, venueBrands) {
  // step through each venue brand tag
  for (let i = 0, l = venueBrands.length; i < l; i++) {
    // the the venue brand is in the brands filter
    if (brands.indexOf(venueBrands[i].slug) > -1) {
      return true;
    }
  }

  // no venue brands found in the filter
  return false;
}

function fetchVenues(mapCenter, distance) {

  return function(dispatch, getState) {

    // set new distance
    let amendedDistance = window.innerWidth < 480 ? distance / 3 : distance;

    console.log('amendedDistance', amendedDistance);

    // Inform app state that we've started a request.
    dispatch(requestVenues());
    const state = getState();
    const geoFire = new GeoFire(firebase.database().ref('venues').child('_geofire'));
    let geoQuery = geoFire.query({
      center: [mapCenter.lat, mapCenter.lng],
      radius: amendedDistance
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
      let promises = receivedVenues.map(function(item, index) {
        return firebase.database().ref('venues/' + receivedVenues[index].key).once('value', function(snapshot) {
          let brands = window.__INITIAL_STATE__.app.firebase.brands;
          let venue = snapshot.val();

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
        if (state.app.search.searchTerm !== '') {
          dispatch(fetchClosestVenues(mapCenter, receivedVenuesFull))
        } else {
          dispatch(receiveVenues(receivedVenuesFull));
          dispatch(receiveClosestVenuesSearch(new Map()))
        }
      });
    });

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


function initialiseFirebase(firebaseReducer, dispatch){

  // If parse hasn't been initialized do so here.
  if(firebaseReducer.isInitialized) {
    return false;
  }

  const firebaseConfig = {
    apiKey: window.__INITIAL_STATE__.app.firebase.api_key,
    authDomain: window.__INITIAL_STATE__.app.firebase.auth_domain,
    databaseURL: window.__INITIAL_STATE__.app.firebase.db_url,
    storageBucket: window.__INITIAL_STATE__.app.firebase.storage_bucket,
  };

  firebase.initializeApp(firebaseConfig);

  dispatch(initializeFirebase());
}

export function fetchVenuesIfNeeded(mapCenter, distance) {
  return (dispatch, getState) => {

    const state = getState()
    const firebaseReducer = state.app.firebaseReducer

    // Conditionally initialise firebase.
    if (!firebaseReducer.isInitialized) {
      initialiseFirebase(firebase, dispatch)
    }

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
    dispatch(requestClosestVenues())

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
          dispatch(panToLocation(venues.location))
          dispatch(receiveVenues([venues]))
        } else {
          dispatch(receiveVenues(venues))
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
