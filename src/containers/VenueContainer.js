import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { requestSingleVenue } from '../actions/venues'

import Venue from '../components/Venue'

class VenueContainer extends Component {

  constructor(props) {
    super(props)
  }

  componentDidUpdate(nextProps) {
    if(this.props.params.name != this.props.venue.slug){
      this.props.requestSingleVenue(this.props.params.name)
    }
  }

  componentWillMount(){
    this.props.requestSingleVenue(this.props.params.name)
  }

  render() {
    // If venue is empty for example on first load with venue slug.
    if(Object.keys(this.props.venue).length === 0){
      return null
    }

    // Blur focus on textfield if it's currently active.
    if(document.activeElement.type === 'text'){
      document.activeElement.blur()
    }

    const { venue } = this.props

    return (
      <Venue
        {...this.props.params}
        {...this.props.venue}
        site={this.props.site}
        pushState={this.props.pushState}
        />
    )
  }
}


function mapStateToProps(state) {
  return {
    venue : state.app.venues.active,
    site  : state.app.site
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({requestSingleVenue, pushState}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VenueContainer)
