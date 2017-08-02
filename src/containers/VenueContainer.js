import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { requestSingleVenue } from '../actions/venues'

import Venue from '../components/Venue'

class VenueContainer extends Component {

  constructor(props) {
    super(props)
    /*
      If venue 'name' from route params e.g. venue-name from /food-guide/venue-name
      doesn't match 'slug' returned from the API for a venue, the componentDidUpdate
      method will recursively fire
      This was discovered due to a malformed querystring from the email team e.g.
      /food-guide/venue&another-query?search
    */
    this.paramsName = this.props.params.name.indexOf('&') > -1 ?
      this.props.params.name.split('&')[0] :
      this.props.params.name
  }

  componentDidUpdate() {
    if (this.paramsName !== this.props.venue.slug) {
      this.props.requestSingleVenue(this.paramsName)
    }
  }

  componentWillMount() {
    this.props.requestSingleVenue(this.paramsName)
  }

  render() {
    // if the venue is being fetched
    const isLoading = this.paramsName != this.props.venue.slug

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
        closestVenues={this.props.closestVenues}
        isLoading={isLoading}
      />
    )
  }
}


function mapStateToProps(state) {
  return {
    closestVenues : state.app.venues.closest,
    venue         : state.app.venues.active,
    site          : state.app.site
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestSingleVenue,
    pushState
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VenueContainer)
