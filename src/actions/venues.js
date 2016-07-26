import fetch from 'isomorphic-fetch';
// import { Parse } from 'parse';
import * as types from '../constants/ActionTypes';
import { panToLocation } from '../actions/map';
// import { getVenueQuery } from '../utils/ParseUtils';
import firebase from 'firebase';
import GeoFire from 'geofire';

// function initializeParse() {
//   return {
//     type: types.INITIALIZE_PARSE
//   }
// }

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
    items: [data],
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

function fetchVenues(mapCenter, distance) {

  return function(dispatch, getState) {

    // Inform app state that we've started a request.
    dispatch(requestVenues());
    const state = getState();
    const geoFire = new GeoFire(firebase.database().ref('venues/_geofire'));
    let geoQuery = geoFire.query({
      center: [mapCenter.lat, mapCenter.lng],
      radius: distance
    });
    let receivedVenues = [];

    geoQuery.on('ready', function(key, location, distance) {
      // console.log('ready', receiveVenues);

      for (var i = 0, l = receivedVenues.length; i < l; i++) {
        firebase.database().ref('venues/' + receivedVenues[i].key).once('value', function(snapshot) {
          // console.log(snapshot.val());
          dispatch(receiveVenues(snapshot.val()))
        });
      }
    });
    geoQuery.on('key_entered', function(key, location, distance) {
      receivedVenues.push({
        key: key,
        location: location,
        disctance: distance
      });
    });

  }

  // return function(dispatch, getState){
  //   // Inform app state that we've started a request.
  //   dispatch(requestVenues())
  //   const state = getState()
  //   const items = state.app.venues.items
  //   const parse = state.app.parse

  //   const swBounds = bounds.getSouthWest()
  //   const neBounds = bounds.getNorthEast()

  //   const query = getVenueQuery(parse)
  //   const sw = new Parse.GeoPoint(swBounds.lat, swBounds.lng)
  //   const ne = new Parse.GeoPoint(neBounds.lat, neBounds.lng)
  //   query.withinGeoBox("location", sw, ne).limit(1000)

  //   // If we already have some venues then exclude them from
  //   // query to Parse.
  //   if(items.size > 0){
  //     query.notContainedIn('slug', Array.from(items.keys()))
  //   }

  //   return query.find()
  //     .then(results => {
  //       // if there is a search
  //       if (state.app.search.searchTerm !== '') {
  //         dispatch(fetchClosestVenues(state.app.map.center, results))
  //       } else {
  //         dispatch(receiveVenues(results))
  //         dispatch(receiveClosestVenuesSearch(new Map()))
  //       }
  //     }, ex => {
  //       dispatch(requestVenuesError(bounds))
  //       console.log('parsing failed', ex)
  //     })
  // }
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

// function initialiseParse(parse, dispatch){
//   // If parse hasn't been initialized do so here.
//   if(!parse.isInitialized){
//     Parse.initialize(parse.parse_app_id, parse.parse_js_key);
//     dispatch(initializeParse())
//   }
// }

function initialiseFirebase(firebaseReducer, dispatch){

  // If parse hasn't been initialized do so here.
  if(firebaseReducer.isInitialized) {
    return false;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyBTJAJMSpkPjEPbWkrlphZ4FQ1bsJum0eY",
    authDomain: "venues-database.firebaseapp.com",
    databaseURL: "https://venues-database.firebaseio.com",
    storageBucket: "venues-database.appspot.com",
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

    // if (!canUseParse()) {
    //   return dispatch(setBrowserIncompatible())
    // }

    // Check conditions under which we should fetch.
    if (shouldFetchVenues(state)) {
      return dispatch(fetchVenues(mapCenter, distance))
    }
  }
}

function fetchSingleVenue(name){
  // return function(dispatch, getState){
  //   // Inform app state that we've started a request.
  //   dispatch(requestVenues())

  //   const parse = getState().app.parse
  //   const query = getVenueQuery(parse)
  //   query.equalTo("slug", name);

  //   return query.find()
  //     .then(results => {
  //       dispatch(receiveVenues(results))
  //       dispatch(requestSingleVenue(name))
  //     }, ex => {
  //       dispatch(requestVenuesError(bounds))
  //       console.log('parsing failed', ex)
  //     })

  // }
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
    } else {
      console.log('no venue found');
      // dispatch(fetchSingleVenue(name))
    }
  }

}

export function fetchClosestVenues(mapCenter, venues, type = 'search') {
  return function(dispatch, getState) {

    dispatch(setVenueActive(venues))

  //   // Inform app state that we've started a request.
  //   dispatch(requestClosestVenues())
  //   const state = getState()
  //   const parse = state.app.parse

  //   const query = getVenueQuery(parse)
  //   const mapCentre = new Parse.GeoPoint(mapCenter[0], mapCenter[1])

  //   query.withinMiles("location", mapCentre, 1).limit(10)

  //   // the it's a single search
  //   if (type === 'venue-overlay') {
  //     // remove the active venue from the search
  //     query.notEqualTo('slug', venues.slug)
  //   }

  //   return query.find()
  //     .then(results => {
  //       // the it's a single search
  //       if (type === 'venue-overlay') {
  //         dispatch(setVenueActive(venues))
  //         dispatch(panToLocation(venues.location))
  //         dispatch(receiveClosestVenues(results))
  //       } else {
  //         dispatch(receiveVenues(venues))
  //         dispatch(receiveClosestVenuesSearch(results))
  //       }
  //     }, ex => {
  //       dispatch(requestClosestVenuesError(mapCenter))

  //       if (type === 'venue-overlay') {
  //         dispatch(setVenueActive(venues))
  //         dispatch(panToLocation(venues.location))
  //       } else {
  //         dispatch(receiveVenues(venues))
  //       }

  //       console.log('parsing failed', ex)
  //     })
  }
}

export function setVenueInactive(){
  return {
    type: types.SET_VENUE_INACTIVE
  }
}

// function canUseParse(){
//   var msie = document.documentMode;
//   return ! msie
//     || msie > 9
// }

// export function setBrowserIncompatible(){
//   return {
//     type: types.SET_BROWSER_INCOMPATIBLE
//   }
// }

