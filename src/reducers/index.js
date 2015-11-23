import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';
import { convertObjects } from '../utils/ParseUtils';

// Reducer composition/splitting. Deligating responsiblity
// for different parts of the state to individual funcs.
// http://rackt.org/redux/docs/basics/Reducers.html#splitting-reducers
function venues(state = {
  isFetching : false,
  items : new Map(),
}, action) {
  switch (action.type) {
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

function map(state = {
  activeBounds : []
}, action){
  switch (action.type) {
  // FIXME: No longer used.
  case types.UPDATE_MAP:
    return Object.assign({}, state, {
      activeBounds: action.bounds
    })
  default:
    return state;
  }
}

function search(state = {
  searchTerm : '',
  bounds : {northeast:{}, southwest:{}},
  timer : -1
}, action){
  switch (action.type) {
  case types.SEARCH_LOCATION_REQUEST:
    return Object.assign({}, state, {
      searchTerm: action.searchTerm,
      timer: action.timer,
      isDebouncing: true
    })
  case types.SEARCH_LOCATION_SUCCESS:
    return Object.assign({}, state, {
      bounds: action.geometry.viewport,
    })
  /*
  case types.SEARCH_LOCATION_UNBLOCK:
    return Object.assign({}, state, {
      isDebouncing: false
    })
  */
  default:
    return state;
  }
}

// This reducer is neccessary to handle any
// params passed by window.__INITIAL_STATE__
// as well as initializing parse.
function parse(state = {
  parse_app_id: '',
  parse_js_key: '',
  isInitialized:false
}, action){
  switch (action.type) {
  case types.INITIALIZE_PARSE:
		return Object.assign({}, state, {
			isInitialized: true
		})
  default:
    return state;
  }
}

const app = combineReducers({
  venues,
  map,
  search,
  parse
});

export default app;
