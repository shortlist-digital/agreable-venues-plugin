import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';

// Reducer composition/splitting. Deligating responsiblity
// for different parts of the state to individual funcs.
// http://rackt.org/redux/docs/basics/Reducers.html#splitting-reducers
import { venues } from './venues'
import { map } from './map'
import { search } from './search'

const initialState = {
  parse_app_id: '',
  parse_js_key: '',
  isInitialized:false,
  brands: [],
  venue_types: [],
  tags: [],
}

function parse(state = initialState, action){

  // https://github.com/rackt/redux/issues/433
  if (!state.hydrated) {
    state = {...initialState, ...state, hydrated: true}
  }

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
