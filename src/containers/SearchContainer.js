import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import { bindActionCreators } from 'redux'

import {
  requestLocationImmediate,
  requestLocationDebounce
} from '../actions/search-location'
import { geolocate } from '../actions/map'

import Search from '../components/Search'

class SearchContainer extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Search
        {...this.props.search}
        closestVenues={this.props.closestVenues}
        hasVenueRoute={!!this.props.venueRoute}
        isFetching={this.props.isFetching}
        isGeolocated={this.props.map.isGeolocated}
        isLocating={this.props.search.isLocating}
        isSearching={this.props.isSearching}
        onGeolocate={this.props.geolocate}
        onImmediateSearch={value =>
          this.props.requestLocationImmediate(value)
        }
        onDebounceSearch={value =>
          this.props.requestLocationDebounce(value)
        }
        pushState={this.props.pushState}
      />
    )
  }

}

function mapStateToProps(state) {
  return {
    closestVenues : state.app.venues.closestSearch,
    search        : state.app.search,
    map           : state.app.map,
    venueRoute    : state.router.params.name,
    isFetching    : state.app.venues.isFetching,
    isSearching   : state.app.venues.isSearching
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestLocationImmediate,
    requestLocationDebounce,
    geolocate,
    pushState
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
