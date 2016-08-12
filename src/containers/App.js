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

  renderOutdated() {

    return  this.props.isBrowserIncompatible ?
        <div className="venues__outdated">
          I'm afraid your browser will not work with our map. Please <a href="http://windows.microsoft.com/en-gb/internet-explorer/download-ie">update your browser</a> and visit us again.
        </div> : null

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
        {this.renderOutdated()}
        {this.props.isFetching ? <p className="venues-loading">Loading...</p> : null}
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
    venues : state.app.venues.items,
    isBrowserIncompatible : state.app.venues.isBrowserIncompatible,
    isFetching : state.app.venues.isFetching
  }
}

export default connect(mapStateToProps)(App)
