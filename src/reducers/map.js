import * as types from '../constants/ActionTypes';

export function map(state = {
  isLocating : false,
  bounds : {northeast:{}, southwest:{}},
  focusLocation : [],
}, action){
  switch (action.type) {
  case types.PAN_TO_LOCATION:
    return Object.assign({}, state, {
      focusLocation : action.latLng
    });
  case types.GEOLOCATE_REQUEST:
    return Object.assign({}, state, {
      isLocating: true,
    })
  case types.GEOLOCATE_SUCCESS:
    return Object.assign({}, state, {
      isLocating: false,
    })
  case types.SEARCH_LOCATION_SUCCESS:
    return Object.assign({}, state, {
      bounds: action.geometry.viewport,
    })
  default:
    return state;
  }
}
