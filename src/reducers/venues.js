import * as types from '../constants/ActionTypes';
import { convertObjects } from '../utils/ParseUtils';

export function venues(state = {
  isFetching : false,
  items : new Map(),
  active : {}
}, action) {
  switch (action.type) {
  case types.SET_ACTIVE_VENUE:
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
  default:
    return state;
  }
}

