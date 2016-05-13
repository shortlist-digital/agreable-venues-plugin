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

  render() {
    let venues = Array.from(this.props.venues)

    if (venues.length < 1) {
      return null
    }

    return (
      <div className="venues-closest">
        <h2>More venues around this area:</h2>
        <ul>
          {
            venues.map((item, i) => {
              let venue = item[1]

              if (i < this.props.displayNumber) {
                return (
                  <li key={i}>
                    <a href={'/food-guide/' + venue.slug} data-slug={venue.slug} onClick={this.handleVenueChange}>
                      <img alt="" src={venue.images[0].landscape.url} />
                      <h3 dangerouslySetInnerHTML={this.createHTML(venue.name)} />
                    </a>
                  </li>
                )
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