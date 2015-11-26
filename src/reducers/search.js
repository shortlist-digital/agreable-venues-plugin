import * as types from '../constants/ActionTypes';

export function search(state = {
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
  default:
    return state;
  }
}
