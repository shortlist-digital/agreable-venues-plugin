import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';


function convertParseObject(){


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
      items: [
        ...state.venues.items, {
        // TODO: Add new objects here.#
        // Consider using Immutable.js Maps
      }],
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

// This reducer is neccessary to handle any
// params passed by window.__INITIAL_STATE__
// as well as initializing parse.
export function parse(state = {
  parse_app_id: '',
  parse_js_key: '',
  isInitialized:false
}, action){
  switch (action.type) {
  case ActionTypes.INITIALIZE_PARSE:
		return Object.assign({}, state, {
			isInitialized: true
		})
  default:
    return state;
  }
}
