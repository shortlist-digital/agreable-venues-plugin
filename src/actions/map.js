import * as types from '../constants/ActionTypes';

import { fetchClosestVenues } from './venues';

export function geolocate(){
  return {
    type: types.GEOLOCATE_REQUEST
  }
}

export function geolocateSuccess() {
  return {
    type: types.GEOLOCATE_SUCCESS
  }
}

export function onPanToLocation(latLng) {
  return {
    type: types.PAN_TO_LOCATION,
    latLng
  }
}

export function panToLocation(latLng, type = 'venue-overlay') {

  return function(dispatch, getState) {

    if (type === 'search') {
      // get closest venues to user
      dispatch(fetchClosestVenues(latLng, false));
    } else {
      dispatch(onPanToLocation(latLng));
    }

  }
}
