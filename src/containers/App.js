import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Components.
import SearchContainer from '../containers/SearchContainer'
import MapContainer from '../containers/MapContainer'

class App extends Component {

  constructor(props) {
    super(props)
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
        <h2 className="venues__count">{this.props.venues.size}</h2>
        <MapContainer />
        <SearchContainer />
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
  children: PropTypes.node,
  venues: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    venues : state.app.venues.items
  }
}

export default connect(mapStateToProps)(App)
