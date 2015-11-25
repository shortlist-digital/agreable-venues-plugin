import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as mapActions from '../actions/map'
import * as venuesActions from '../actions/venues'

import Map from '../components/Map'

class MapContainer extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Map
        {...this.props.map}
        onGeolocateSuccess={this.props.geolocateSuccess}
        onMoveEnd={this.props.fetchVenuesIfNeeded}
        pushState={this.props.pushState}
        venues={this.props.venues}
        activeVenue={!!this.props.activeVenue}
        focusLocation={this.props.focusLocation}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    map           : state.app.map,
    venues        : state.app.venues.items,
    focusLocation : state.app.map.focusLocation,
    activeVenue   : state.router.params.name
  }
}

function mapDispatchToProps(dispatch) {
  const allActions = Object.assign({}, mapActions, venuesActions, { pushState } );
  return bindActionCreators(allActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
