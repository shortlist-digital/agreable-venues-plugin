import React, {Component, PropTypes} from 'react'
import { pushState, replaceState } from 'redux-router'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchLocationIfAllowed } from '../actions'

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
          dispatch={this.props.dispatch}
          basename={this.props.basename}
          pushState={this.props.pushState}
          searchBounds={this.props.search.bounds}
          venues={this.props.venueItems}
        />
        <Search
          {...this.props.search}
          onSearch={value =>
            this.props.searchLocationAction(value)
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
    searchLocationAction: bindActionCreators(fetchLocationIfAllowed, dispatch),
    pushState: bindActionCreators(pushState, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
