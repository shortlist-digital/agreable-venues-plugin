import * as ActionTypes from '../actions';

const initialMap = [0.1, 0.2];
const initialVenues = {
  isFetching: false,
  items: []
}

function venues(state = [], action) {
  switch (action.type) {
    case ActionTypes.SEARCH_LOCATION:
      return Object.assign({}, state, {
        searchTerm: action.searchTerm
      })
    default:
      return state;
  }
}

export default venues;
