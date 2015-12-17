import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
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
        hasVenueRoute={!!this.props.venueRoute}
        isLocating={this.props.map.isLocating}
        onGeolocate={this.props.geolocate}
        onImmediateSearch={value =>
          this.props.requestLocationImmediate(value)
        }
        onDebounceSearch={value =>
          this.props.requestLocationDebounce(value)
        } />
    )
  }

}

function mapStateToProps(state) {
  return {
    search      : state.app.search,
    map         : state.app.map,
    venueRoute  : state.router.params.name
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestLocationImmediate,
    requestLocationDebounce,
    geolocate
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
