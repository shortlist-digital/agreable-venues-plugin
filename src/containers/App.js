import React, {Component, PropTypes} from 'react'
import { pushState, replaceState } from 'redux-router'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import {
  requestLocationDebounce,
  requestLocationImmediate,
  geolocate,
  geolocateSuccess
} from '../actions/search-location'
import { fetchVenuesIfNeeded } from '../actions/venues'

// Components.
import Search from '../components/Search'
import Map from '../components/Map'

class App extends Component {

  constructor(props) {
    super(props)
  }

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const links = [
      '/',
      '/a-test-venue',
      '/another-test-venue',
    ].map((l,i) =>
      <div key={i}>
        <Link to={l}>{l}</Link>
      </div>
    )

    return (
      <div className="venues">
        <h2 className="venues__count">{this.props.venueItems.size}</h2>
        <Map
          {...this.props.map}
          onGeolocateSuccess={this.props.geolocateSuccessAction}
          onMoveEnd={this.props.fetchVenuesAction}
          basename={this.props.basename}
          pushState={this.props.pushState}
          venues={this.props.venueItems}
        />
        <Search
          {...this.props.search}
          isLocating={this.props.map.isLocating}
          onGeolocate={this.props.geolocateAction}
          onImmediateSearch={value =>
            this.props.searchLocationAction(value)
          }
          onDebounceSearch={value =>
            this.props.searchLocationDebounceAction(value)
          } />
        {this.props.children}
        <div className="venues__links-test">
          <h3>Test links</h3>
          {links}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  pushState: PropTypes.func.isRequired,
  children: PropTypes.node,
  venueItems: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    search      : state.app.search,
    map         : state.app.map,
    venueItems  : state.app.venues.items,
    basename    : state.router.location.basename
  }
}

function mapDispatchToProps(dispatch) {
  return  {

    // Search
    searchLocationDebounceAction: bindActionCreators(requestLocationDebounce, dispatch),
    searchLocationAction: bindActionCreators(requestLocationImmediate, dispatch),
    geolocateAction: bindActionCreators(geolocate, dispatch),
    geolocateSuccessAction: bindActionCreators(geolocateSuccess, dispatch),

    // Venues
    fetchVenuesAction: bindActionCreators(fetchVenuesIfNeeded, dispatch),

    // Router.
    pushState: bindActionCreators(pushState, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
