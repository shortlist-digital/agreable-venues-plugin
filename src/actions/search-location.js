import * as types from '../constants/ActionTypes';

/*
 * Action creators
 */
export function requestLocationDebounce(searchTerm) {
  return (dispatch, getState) => {

    const state = getState()
    const search = state.app.search

    clearTimeout(search.timer)
    const timer = setTimeout(() => {
      dispatch(fetchLocation())
    }, 1000)

    // Add search term to state on every request and
    // we extract it when timer completes.
    return dispatch(requestLocation(searchTerm, timer))
  }
}

function requestLocation(searchTerm, timer) {
  return {
    type: types.SEARCH_LOCATION_REQUEST,
    searchTerm,
    timer
  }
}

/*
 * Cancels debouncing and immediately fetches.
 */
export function requestLocationImmediate(searchTerm){
  return (dispatch, getState) => {
    const state = getState()
    const search = state.app.search
    // Clear timer.
    clearTimeout(search.timer)
    // Set search term on state.
    dispatch(requestLocation(searchTerm, -1))
    return dispatch(fetchLocation());
  }
}

function fetchLocation(){
  return (dispatch, getState) => {

    const searchTerm = getState().app.search.searchTerm
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="
    const url = `${apiUrl}${encodeURIComponent(searchTerm)}+UK`

    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        if(data.results.length > 0){
          dispatch(fetchLocationSuccess(data.results[0].geometry));
        }
      })
  }
}

function fetchLocationSuccess(geometry){
  return {
    type: types.SEARCH_LOCATION_SUCCESS,
    geometry
  }
}


