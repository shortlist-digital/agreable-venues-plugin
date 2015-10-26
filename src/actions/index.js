/*
 * Action types
 */
export const SEARCH_LOCATION = 'SEARCH_LOCATION'

export const UPDATE_MAP = 'UPDATE_MAP'

export const SHOW_VENUE = 'SHOW_VENUE'

/*
 * Action creators
 */
export function searchLocation(searchTerm) {
  return {
    type: SEARCH_LOCATION,
    searchTerm
  };
}

export function updateMap(latLngList) {
  return {
    type: UPDATE_MAP,
    latLngList
  };
}

