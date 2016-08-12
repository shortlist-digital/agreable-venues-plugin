import * as types from '../constants/ActionTypes';

const initialState = {
  isLocating : false,
  isGeolocated : false,
  bounds : {northeast:{}, southwest:{}},
  center : [],
  focusLocation : [],
  tileURL: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
}

export function map(state = initialState, action){

  // https://github.com/rackt/redux/issues/433
  if (!state.hydrated) {
    state = {...initialState, ...state, hydrated: true}
  }

  switch (action.type) {
  case types.PAN_TO_LOCATION:
    return Object.assign({}, state, {
      focusLocation : action.latLng
    });
  case types.GEOLOCATE_REQUEST:
    return Object.assign({}, state, {
      isLocating: true,
      isGeolocated: false
    })
  case types.GEOLOCATE_SUCCESS:
    return Object.assign({}, state, {
      isLocating: false,
      isGeolocated: true
    })
  case types.SEARCH_LOCATION_REQUEST:
    return Object.assign({}, state, {
      isGeolocated: false
    })
  case types.SEARCH_LOCATION_SUCCESS:
    return Object.assign({}, state, {
      bounds: action.geometry.viewport,
      center: [action.geometry.location.lat, action.geometry.location.lng],
    })
  default:
    return state;
  }
}
