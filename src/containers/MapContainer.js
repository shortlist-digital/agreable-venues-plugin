import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { geolocateSuccess, panToLocation } from '../actions/map'
import { fetchVenuesIfNeeded, setVenueInactive } from '../actions/venues'

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
        panToLocation={this.props.panToLocation}
        fetchMarkers={this.props.fetchVenuesIfNeeded}
        pushState={this.props.pushState}
        venues={this.props.venues}
        setVenueInactive={this.props.setVenueInactive}
        hasVenueRoute={!!this.props.venueRoute}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    map           : state.app.map,
    venues        : state.app.venues.items,
    venueRoute    : state.router.params.name,
    pathname      : state.router.location.pathname
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    geolocateSuccess,
    fetchVenuesIfNeeded,
    panToLocation,
    setVenueInactive,
    pushState
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
