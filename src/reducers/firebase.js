import * as types from '../constants/ActionTypes';

const initialState = {
  firebase_app_id: '',
  firebase_js_key: '',
  isInitialized:false,
  brands: [],
  venue_types: [],
  tags: [],
}

export function firebaseReducer(state = initialState, action){

  // https://github.com/rackt/redux/issues/433
  if (!state.hydrated) {
    state = {...initialState, ...state, hydrated: true}
  }

  switch (action.type) {
  case types.INITIALIZE_FIREBASE:
		return Object.assign({}, state, {
			isInitialized: true
		})
  default:
    return state;
  }
}
