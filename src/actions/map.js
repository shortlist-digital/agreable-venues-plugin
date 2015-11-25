import * as types from '../constants/ActionTypes';

export function geolocate(){
  return {
    type: types.GEOLOCATE_REQUEST
  }
}

export function geolocateSuccess(){
  return {
    type: types.GEOLOCATE_SUCCESS
  }
}

export function panToLocation(latLng){
  return {
    type: types.PAN_TO_LOCATION,
    latLng
  }
}

