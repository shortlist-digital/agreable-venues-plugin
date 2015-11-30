import React, {Component, PropTypes} from 'react';

const classNames = require('classnames')

class Venue extends Component {

  renderVenueTypes(){
    const venue_types = this.props.venue_type
    // Array.from & Array.map are not working on objects.
    // Perhaps an issue with transpiling on Babel 5.
    const types = Object.keys(venue_types).map(i => venue_types[i])

    if(!types.length){
      return null
    }

    return (
      <h3 className="venue-types">
        {types.map((item, i) => {
          return (
            <span key={`type-${item.slug}`} className="venue-types__type">{item.name}</span>
          )
        })}
      </h3>
    )
  }

  renderImage() {
    if(!Object.keys(this.props.images).length){
      return null
    }

    return (
      <div className="venue-overlay__img">
        <img src={this.props.images[0].landscape.url} title={this.props.name} />
      </div>
    )
  }

  renderSocialItem(name, href){
    const socialClasses = classNames(
      'venue-social__item',
      'venue-social__item--' + name
    );

    return (
      <span className={socialClasses}>
        <a target="_blank" href={href}>{name}</a>
      </span>
    )
  }

  rawMarkup(){
    return { __html: this.props.review };
  }

  renderWebsite(){
    if(!this.props.website){
      return null
    }

    return (
      <div className="venues-overlay__website">
        <a href={this.props.website} title={this.props.name}>Website</a>
      </div>
    )
  }

  renderSocial(){
    return (
      <div className="venue-social">
        {(this.props.instagram) ?
          this.renderSocialItem('instagram',` http://instagram.com/${this.props.instagram}`):null }
        {(this.props.facebook) ?
          this.renderSocialItem('facebook', this.props.facebook):null }
        {(this.props.twitter) ?
          this.renderSocialItem('twitter', `http://twitter.com/${this.props.twitter}`):null }
      </div>
    )
  }

  renderPrice(){
    const price = this.props.price

    if(!price) {
      return null
    }

    const max = 4
    const ints = new Array(...Array(max))

    return (
      <div className='venue-price'>
        {ints.map((x, i) => {
          const priceClasses = classNames({
            'venue-price__symbol': true,
            'venue-price__symbol--active': (i<parseInt(price))
          })
          return (<span className={priceClasses} key={i}>{String.fromCharCode(163)}</span>)
        })}
      </div>
    )
  }

  renderTags(tags){
    const venue_tags = this.props.tags
    // Array.from & Array.map are not working on objects.
    // Perhaps an issue with transpiling on Babel 5.
    tags = Object.keys(venue_tags).map(i => venue_tags[i])

    if(!tags.length){
      return null
    }

    return (
      <div className="venue-tags">
        {tags.map((item, i) => {
          return (
            <span key={`tag-${item.slug}`} className="venue-tags__tag">{item.name}</span>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div className='venue-overlay'>
        <header>
          <h1>{this.props.name}</h1>
          <h2>{this.props.address}</h2>
          {this.renderVenueTypes()}
        </header>
        {this.renderImage()}
        <p dangerouslySetInnerHTML={this.rawMarkup()} />
        {this.renderWebsite()}
        {this.renderSocial()}
        {this.renderPrice()}
        {this.renderTags()}
      </div>
    );
  }
}

Venue.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  venue_type: PropTypes.object,
  images: PropTypes.object.isRequired,
  review: PropTypes.string.isRequired,
  website: PropTypes.string,
  instagram: PropTypes.string,
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  price: PropTypes.string,
  tags: PropTypes.object
}

export default Venue;
