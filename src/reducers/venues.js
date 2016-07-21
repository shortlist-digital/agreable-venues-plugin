import * as types from '../constants/ActionTypes';
import { convertObjects } from '../utils/ParseUtils';

export function venues(state = {
  isBrowserIncompatible : false,
  isFetching : false,
  items : new Map(),
  active : {},
  closest : new Map(),
  closestSearch : new Map(),
}, action) {
  switch (action.type) {
  case types.SET_BROWSER_INCOMPATIBLE:
    return Object.assign({}, state, {
      isBrowserIncompatible : true
    });
  case types.SET_VENUE_INACTIVE:
    return Object.assign({}, state, {
      active : {}
    });
  case types.SET_VENUE_ACTIVE:
    return Object.assign({}, state, {
      active : action.venue
    });
  case types.REQUEST_VENUES:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case types.RECEIVE_VENUES:
    // Merging of new venues and existing venues into a ES6 Map()
    // Without `Array.from()` you cannot merge the old and new Maps
    // as per this: http://stackoverflow.com/a/32000937
    // Maybe an issue with transpiling.
    const newVenues = Array.from(convertObjects(action.items))
    const currentVenues = Array.from(state.items)
    return Object.assign({}, state, {
      isFetching: false,
      items: new Map([...newVenues, ...currentVenues]),
      lastUpdated: action.receivedAt
    })
  case types.REQUEST_VENUES_FAILURE:
    return Object.assign({}, state, {
      isFetching: false
    })
  case types.REQUEST_CLOSEST_VENUES:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case types.RECEIVE_CLOSEST_VENUES:
    const newClosestVenues = Array.from(convertObjects(action.items))
    return Object.assign({}, state, {
      isFetching: false,
      closest: new Map([...newClosestVenues]),
      lastUpdated: action.receivedAt
    });
  case types.REQUEST_CLOSEST_VENUES_SEARCH:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case types.RECEIVE_CLOSEST_VENUES_SEARCH:
    const newClosestVenuesSearch = Array.from(convertObjects(action.items))
    return Object.assign({}, state, {
      isFetching: false,
      closestSearch: new Map([...newClosestVenuesSearch]),
      lastUpdated: action.receivedAt
    });
  case types.REQUEST_CLOSEST_VENUES_FAILURE:
    return Object.assign({}, state, {
      isFetching: false
    });
  default:
    return state;
  }
}

