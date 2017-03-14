import React, {Component, PropTypes} from 'react';

const classNames = require('classnames')

class ClosestVenues extends Component {

  constructor(props){
    super(props)
    this.handleVenueChange = this.handleVenueChange.bind(this)
  }

  createHTML(content) {
    return { __html: content };
  }

  handleVenueChange(e) {
    e.preventDefault()
    this.props.pushState({}, '/' + e.currentTarget.getAttribute('data-slug'))
  }

  convertDistance(distance) {
    // (meters / 1000) / 1.6 = km = meters / 1600 
    return (distance / 1600).toFixed(2);
  }

  render() {
    let venues = Array.from(this.props.venues);
    let displayNumber = this.props.displayNumber;
    // one venue will always be returned as it'll be the venue that is currently selected on overlays
    let displayThreshold = this.props.displayLocation === 'search' ? 1 : 2;

    if (venues.length < displayThreshold) {
      return (
        <div className="venues-search__no-results">
          <p>Sorry, but we couldn't find any venues at this location.</p>
        </div>
      );
    }

    // sort the venues by distance
    venues.sort(function(a, b) {
      if (a[1].distance > b[1].distance) {
        return 1;
      } else {
        return -1;
      }
    });

    return (
      <div className="venues-closest">
        <h2>More venues around this area:</h2>
        <ul>
          {
            venues.map((item, i) => {
              let venue = item[1]

              if (i <= this.props.displayNumber && venue.slug !== this.props.parentSlug) {
                return (
                  <li key={ venue.id }>
                    <a href={'/food-guide/' + venue.slug} data-slug={venue.slug} onClick={this.handleVenueChange}>
                      { venue.image_url ?
                        <img alt="" src={venue.image_url} />
                      : null }
                      <h3 dangerouslySetInnerHTML={this.createHTML(venue.name)} />
                      <p className="venues-closest-distance">{this.convertDistance(venue.distance)} miles away</p>
                    </a>
                  </li>
                )
              } else {
                displayNumber += 1;
              }
            })
          }
        </ul>
      </div>
    );
  }
}

ClosestVenues.propTypes = {
  displayNumber: PropTypes.number,
  venues: PropTypes.object.isRequired
}

ClosestVenues.defaultProps = {
  displayNumber: 5
}

export default ClosestVenues;
