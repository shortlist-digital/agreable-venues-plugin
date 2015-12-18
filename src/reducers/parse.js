import * as types from '../constants/ActionTypes';

const initialState = {
  parse_app_id: '',
  parse_js_key: '',
  isInitialized:false,
  brands: [],
  venue_types: [],
  tags: [],
}

export function parse(state = initialState, action){

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
