import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../actions/search-location'
import Search from '../components/Search'

class SearchContainer extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Search
        {...this.props.search}
        isLocating={this.props.map.isLocating}
        onGeolocate={this.props.geolocate}
        onImmediateSearch={value =>
          this.props.requestLocationImmediate(value)
        }
        onDebounceSearch={value =>
          this.props.requestLocationDebounce(value)
        } />
    )
  }

}

function mapStateToProps(state) {
  return {
    search      : state.app.search,
    map         : state.app.map
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
