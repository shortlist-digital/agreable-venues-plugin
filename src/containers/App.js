import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { searchLocation } from '../actions'

import Search from '../components/Search'
import VenuesMap from '../components/VenuesMap'
import { Map, MapComponent, Marker, Popup, TileLayer } from 'react-leaflet'

class App extends Component {

	constructor(props) {
		super(props)
	}

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { dispatch, searchLocationAction } = this.props
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
        <VenuesMap
          dispatch={dispatch}
        />
        <Search
          {...this.props.search}
          onSearch={value =>
            searchLocationAction(value)
          } />
        {this.props.children}
        <h3>Test links</h3>
        {links}
      </div>
    )
  }
}

App.propTypes = {
}

function mapStateToProps(state) {
  return {
    search      : state.app.search,
    map         : state.app.map,
    venueItems  : state.app.venues.items
  }
}

function mapDispatchToProps(dispatch) {
  return  {
    searchLocationAction: bindActionCreators(searchLocation, dispatch),
    pushState,
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
