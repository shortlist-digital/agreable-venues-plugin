import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import 'babel-polyfill'

// Components.
import SearchContainer from '../containers/SearchContainer'
import MapContainer from '../containers/MapContainer'

class App extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const divStyle = {
      height: '100%'
    }

    return (
      <div style={divStyle} className="venues">
        <MapContainer />
        <SearchContainer />
        {this.props.children}
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
