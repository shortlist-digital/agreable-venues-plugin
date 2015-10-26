import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

const initialMap = [0.1, 0.2];
const initialVenues = {
  isFetching: false,
  items: []
}

export function venues(state = {
	isFetching : false,
	items : []
}, action) {
  switch (action.type) {
  case ActionTypes.REQUEST_VENUES:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case ActionTypes.RECEIVE_VENUES:
    return Object.assign({}, state, {
      isFetching: false,
      items: action.items,
      lastUpdated: action.receivedAt
    });
  case ActionTypes.REQUEST_VENUES_FAILURE:
    return Object.assign({}, state, {
      isFetching: false
    });

  default:
    return state;
  }
}

export function map(state = [], action){
  switch (action.type) {
  // FIXME: No longer used.
	case ActionTypes.UPDATE_MAP:
		return Object.assign({}, state, {
			activeBounds: action.bounds
		})
	default:
		return state;
  }
}

export function app(state = [], action){
  switch (action.type) {
	case ActionTypes.SEARCH_LOCATION:
		return Object.assign({}, state, {
			searchTerm: action.searchTerm
		})
	default:
		return state;
  }
}
