import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as geolocateActions from '../actions/geolocate'
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
        basename={this.props.basename}
        pushState={this.props.pushState}
        venues={this.props.venues}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    map         : state.app.map,
    venues      : state.app.venues.items,
    basename    : state.router.location.basename
  }
}

function mapDispatchToProps(dispatch) {
  const allActions = Object.assign({}, geolocateActions, venuesActions, { pushState } );
  return bindActionCreators(allActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
