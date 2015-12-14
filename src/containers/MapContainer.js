import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { geolocateSuccess } from '../actions/map'
import { fetchVenuesIfNeeded } from '../actions/venues'

import Map from '../components/Map'

class MapContainer extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Map
        {...this.props.map}
        pathname={this.props.pathname}
        onGeolocateSuccess={this.props.geolocateSuccess}
        fetchMarkers={this.props.fetchVenuesIfNeeded}
        pushState={this.props.pushState}
        venues={this.props.venues}
        activeVenue={!!this.props.activeVenue}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    map           : state.app.map,
    venues        : state.app.venues.items,
    activeVenue   : state.router.params.name,
    pathname : state.router.location.pathname
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    geolocateSuccess,
    fetchVenuesIfNeeded,
    pushState
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
