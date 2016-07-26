import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';

// Reducer composition/splitting. Deligating responsiblity
// for different parts of the state to individual funcs.
// http://rackt.org/redux/docs/basics/Reducers.html#splitting-reducers
import { venues } from './venues'
import { map } from './map'
import { search } from './search'
// import { parse } from './parse'
import { firebaseReducer } from './firebase'

const initialState = {
  sitename : ''
}

function site(state = initialState, action){
  // https://github.com/rackt/redux/issues/433
  if (!state.hydrated) {
    state = {...initialState, ...state, hydrated: true}
  }

  // No action filters here. Probably never will be. These
  // are essentially constants rendered into the page on the server.
  return state
}

const app = combineReducers({
  venues,
  map,
  search,
  firebaseReducer,
  site
})

export default app
