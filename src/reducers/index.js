import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';

// Reducer composition/splitting. Deligating responsiblity
// for different parts of the state to individual funcs.
// http://rackt.org/redux/docs/basics/Reducers.html#splitting-reducers
import { venues } from './venues'
import { map } from './map'
import { search } from './search'

// This reducer is neccessary to handle any
// params passed by window.__INITIAL_STATE__
// as well as initializing parse.
function parse(state = {
  parse_app_id: '',
  parse_js_key: '',
  isInitialized:false,
  brands: [],
  venue_types: [],
  tags: [],
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
