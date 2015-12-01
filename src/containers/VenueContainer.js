import React, {Component, PropTypes} from 'react'
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

    const { venue } = this.props

    return (
      <Venue
        {...this.props.params}
        {...this.props.venue}
        />
    )
  }
}


function mapStateToProps(state) {
  return {
    venue : state.app.venues.active
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({requestSingleVenue}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VenueContainer)
