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
    const { dispatch, searchLocationAction, currentSearch } = this.props
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
      <div>
        <VenuesMap
          dispatch={dispatch}
          startPosition={[51.572847, -0.106888]}
        />
        <Search
          searchTerm={currentSearch}
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
    currentSearch: state.app.searchTerm
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchLocationAction: bindActionCreators(searchLocation, dispatch),
    pushState,
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
