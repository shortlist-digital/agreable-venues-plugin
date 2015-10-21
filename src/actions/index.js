/*
 * Action types
 */
export const SEARCH_LOCATION = 'SEARCH_LOCATION'
export const MOVE_MAP = 'MOVE_MAP'
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

