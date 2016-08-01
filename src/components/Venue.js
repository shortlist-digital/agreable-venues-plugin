import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import InlineSVG from 'svg-inline-react/lib';
const classNames = require('classnames')

import VenueShare from './VenueShare'
import ClosestVenues from './ClosestVenues'

class Venue extends Component {

  constructor(props){
    super(props)
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate() {
    // move the window to the top
    let overlay = document.querySelector('.venues-overlay')
    overlay.scrollTop = 0;
  }

  handleClose(e){
    this.props.pushState({}, '/')
  }

  rawTitle(){
    return { __html: this.props.name };
  }

  renderVenueTypes(){
    const types = this.props.VenueTypes
    if(!types){
      return null
    }

    return (
      <h2 className="venues-overlay__types">
        {types.map((item, i) => {
          return (
            <span key={`type-${item.slug}`} className="venues-overlay__types__type">{item.name}</span>
          )
        })}
      </h2>
    )
  }

  renderImage() {
    if(!Object.keys(this.props.images).length){
      return null
    }

    return (
      <div className="venues-overlay__img">
        <img src={this.props.images.landscape.url} title={this.props.name} />
      </div>
    )
  }

  renderSocialItem(channel, url){
    const socialClasses = classNames(
      'venues-overlay__social__item',
      'venues-overlay__social__item--' + channel
    );

    let link = ''
    switch(channel){
      case 'website':
        link = <a target="_blank" href={url}>{url}</a>
        break
      case 'instagram':
        link = <a target="_blank" href={`http://instagram.com/${url}`}>{url}</a>
        break
      case 'facebook':
        link = <a target="_blank" href={url}>{url}</a>
        break
      case 'twitter':
        link = <a target="_blank" href={`http://twitter.com/${url}`}>{url}</a>
        break
    }

    return (
      <span className={socialClasses}>
        <InlineSVG src={require(`!svg-inline!../svgs/${channel}.svg`)} />
        {link}
      </span>
    )
  }

  rawReview(){
    return { __html: this.props.info.review };
  }

  rawHTML(html) {
    return { __html: html };
  }

  renderWebsite(){
    if (!this.props.contact.website) {
      return null
    }

    return (
      <div className="venues-overlay__website">
        <a target="_blank" className="default-button" href={this.props.contact.website} title={this.props.name}>Visit Website</a>
      </div>
    )
  }

  renderSocial(){
    if (!this.props.contact.instagram &&
      !this.props.contact.website &&
      !this.props.contact.facebook &&
      !this.props.contact.twitter) {
        return null
    }

    return (
      <div className="venues-overlay__social">
        <h2>About this venue:</h2>
        {(this.props.contact.website) ?
          this.renderSocialItem('website', this.props.contact.website):null }
        {(this.props.contact.instagram) ?
          this.renderSocialItem('instagram', this.props.contact.instagram):null }
        {(this.props.contact.facebook) ?
          this.renderSocialItem('facebook', this.props.contact.facebook):null }
        {(this.props.contact.twitter) ?
          this.renderSocialItem('twitter', this.props.contact.twitter):null }
      </div>
    )
  }

  renderPrice(){
    const price = this.props.info.price

    if (!price) {
      return null
    }

    const max = 4
    const ints = new Array(...Array(max))

    return (
      <div className='venue-price'>
        {ints.map((x, i) => {
          const priceClasses = classNames({
            'venue-price__item': true,
            'venue-price__item--active': (i<parseInt(price))
          })
          return (<span className={priceClasses} key={i}>{String.fromCharCode(163)}</span>)
        })}
      </div>
    )
  }

  renderOffer() {
    const offer = this.props.offer;

    if (!offer || offer.details === '') {
      return null
    }

    return (
      <div className='venues-overlay__offer'>
        <h2>Offers:</h2>
        <p dangerouslySetInnerHTML={this.rawHTML(offer.details)} />
        {offer.end_date !== '' ?
          <p>Offer ends at {offer.end_date}</p>
        : null}
      </div>
    );
  }

  renderTags(){
    const tags = this.props.Tags
    if(!tags){
      return null
    }

    return (
      <div className="venues-overlay__tags">
        <h2>Tags:</h2>
        {tags.map((item, i) => {
          return (
            <span key={`tag-${item.slug}`} className="venues-overlay__tags__tag">{item.name}</span>
          )
        })}
      </div>
    )
  }

  renderPhoneLink() {
    return (
      <a className="venues-overlay__phone-number" href={`tel:${this.props.contact.phone_number}`}><InlineSVG src={require(`!svg-inline!../svgs/phone.svg`)} /></a>
    )
  }

  render() {
    const venueClasses = classNames({
      'venues-overlay-container': true,
      'venues-overlay-container--is-loading': this.props.isLoading
    })

    return (
      <div className={venueClasses}>
        <a onClick={this.handleClose} className='venues-overlay-container__close'>
          <span className="venues-overlay-container__close__icon">
            <InlineSVG src={require(`!svg-inline!../svgs/close.svg`)} />
          </span>
          <span className="venues-overlay-container__close__label">Back to map</span>
        </a>
        <div className='venues-overlay'>
          <header>
            {(this.props.contact.phone_number) ? this.renderPhoneLink() : null}
            <h1 dangerouslySetInnerHTML={this.rawTitle()} />
            {this.renderVenueTypes()}
          </header>
          {this.renderImage()}
          <p dangerouslySetInnerHTML={this.rawReview()} />
          {this.renderPrice()}
          {this.renderOffer()}
          {this.renderTags()}
          {this.renderSocial()}
          <VenueShare
            {...this.props.site}
            name={this.props.name}
            review={this.props.info.review}
            image={Object.keys(this.props.images).length
              ? this.props.images[0] : null } />
          <ClosestVenues venues={this.props.closestVenues} parentSlug={this.props.slug} pushState={this.props.pushState} />
        </div>
      </div>
    );
  }
}

// Venue.propTypes = {
//   pushState: PropTypes.func.isRequired,
//   name: PropTypes.string.isRequired,
//   address: PropTypes.string.isRequired,
//   VenueTypes: PropTypes.array,
//   images: PropTypes.object.isRequired,
//   review: PropTypes.string.isRequired,
//   website: PropTypes.string,
//   instagram: PropTypes.string,
//   facebook: PropTypes.string,
//   twitter: PropTypes.string,
//   price: PropTypes.string,
//   Tags: PropTypes.array,
//   copy: PropTypes.object,
// }

Venue.propTypes = {
  pushState: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  contact: PropTypes.object.isRequired,
  VenueTypes: PropTypes.array,
  images: PropTypes.object.isRequired,
  price: PropTypes.string,
  Tags: PropTypes.array,
  offer: PropTypes.object,
}

Venue.defaultProps = {
  images: {}
}

export default Venue;
