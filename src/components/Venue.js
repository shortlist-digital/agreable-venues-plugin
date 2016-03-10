import React, {Component, PropTypes} from 'react';
import InlineSVG from 'svg-inline-react/lib';
const classNames = require('classnames')

import VenueShare from './VenueShare'

class Venue extends Component {

  constructor(props){
    super(props)
    this.handleClose = this.handleClose.bind(this);
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
        <img src={this.props.images[0].square.url} title={this.props.name} />
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
    return { __html: this.props.review };
  }

  renderWebsite(){
    if(!this.props.website){
      return null
    }

    return (
      <div className="venues-overlay__website">
        <a target="_blank" className="default-button" href={this.props.website} title={this.props.name}>Visit Website</a>
      </div>
    )
  }

  renderSocial(){
    if(!this.props.instagram &&
      !this.props.website &&
      !this.props.facebook &&
      !this.props.twitter){
        return null
    }

    return (
      <div className="venues-overlay__social">
        {(this.props.website) ?
          this.renderSocialItem('website', this.props.website):null }
        {(this.props.instagram) ?
          this.renderSocialItem('instagram', this.props.instagram):null }
        {(this.props.facebook) ?
          this.renderSocialItem('facebook', this.props.facebook):null }
        {(this.props.twitter) ?
          this.renderSocialItem('twitter', this.props.twitter):null }
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
            'venue-price__item': true,
            'venue-price__item--active': (i<parseInt(price))
          })
          return (<span className={priceClasses} key={i}>{String.fromCharCode(163)}</span>)
        })}
      </div>
    )
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

  render() {
    return (
      <div className='venues-overlay-container'>
        <a onClick={this.handleClose} className='venues-overlay-container__close'>✖</a>
        <div className='venues-overlay'>
          <header>
            <h1 dangerouslySetInnerHTML={this.rawTitle()} />
            {this.renderVenueTypes()}
          </header>
          {this.renderImage()}
          <p dangerouslySetInnerHTML={this.rawReview()} />
          {this.renderPrice()}
          {this.renderTags()}
          {this.renderSocial()}
          <VenueShare
            {...this.props.site}
            name={this.props.name}
            review={this.props.review}
            image={Object.keys(this.props.images).length
              ? this.props.images[0] : null } />
        </div>
      </div>
    );
  }
}

Venue.propTypes = {
  pushState: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  VenueTypes: PropTypes.array,
  images: PropTypes.object.isRequired,
  review: PropTypes.string.isRequired,
  website: PropTypes.string,
  instagram: PropTypes.string,
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  price: PropTypes.string,
  Tags: PropTypes.array,
  copy: PropTypes.object,
}

Venue.defaultProps = {
  images: {}
}

export default Venue;
