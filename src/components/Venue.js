import React, {Component, PropTypes} from 'react';

import VenueShare from './VenueShare'

const classNames = require('classnames')

class Venue extends Component {

  svgs = {
    instagram : (<svg viewBox="0 0 512 512"><path d="M365.3 234.1h-24.7c1.8 7 2.9 14.3 2.9 21.9 0 48.3-39.2 87.5-87.5 87.5 -48.3 0-87.5-39.2-87.5-87.5 0-7.6 1.1-14.9 2.9-21.9h-24.7V354.4c0 6 4.9 10.9 10.9 10.9H354.4c6 0 10.9-4.9 10.9-10.9V234.1H365.3zM365.3 157.6c0-6-4.9-10.9-10.9-10.9h-32.8c-6 0-10.9 4.9-10.9 10.9v32.8c0 6 4.9 10.9 10.9 10.9h32.8c6 0 10.9-4.9 10.9-10.9V157.6zM256 201.3c-30.2 0-54.7 24.5-54.7 54.7 0 30.2 24.5 54.7 54.7 54.7 30.2 0 54.7-24.5 54.7-54.7C310.7 225.8 286.2 201.3 256 201.3M365.3 398.1H146.7c-18.1 0-32.8-14.7-32.8-32.8V146.7c0-18.1 14.7-32.8 32.8-32.8h218.7c18.1 0 32.8 14.7 32.8 32.8v218.7C398.1 383.4 383.5 398.1 365.3 398.1"></path></svg>),
    facebook: (<svg viewBox="0 0 512 512"><path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"></path></svg>),
    twitter: (<svg viewBox="0 0 512 512"><path d="M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z"></path></svg>),
    website: (<svg viewBox="0 0 16 16"><path d="m7.2415,9.3086c-0.14074,0-0.28148-0.053456-0.38906-0.16104-1.0055-1.0055-1.0055-2.6422,0-3.6484l2.0299-2.0299c0.4872-0.4872,1.1357-0.7558,1.8247-0.7558,0.68881,0,1.337,0.26862,1.8242,0.75579,1.0055,1.0061,1.0055,2.6422,0,3.6484l-0.92766,0.92766c-0.21449,0.21449-0.56295,0.21449-0.77744,0s-0.21449-0.56296,0-0.77745l0.92766-0.92766c0.57716-0.57716,0.57716-1.5163,0-2.0935-0.27945-0.27945-0.65159-0.43372-1.0467-0.43372-0.39515,0-0.7673,0.15427-1.0467,0.43372l-2.0304,2.0298c-0.57716,0.57716-0.57716,1.5163,0,2.0935,0.21449,0.21449,0.21449,0.56295,0,0.77745-0.1076,0.1075-0.2483,0.161-0.3891,0.161z"/><path d="m5.2935,13.286c-0.68881,0-1.337-0.26862-1.8242-0.75579-1.0055-1.0055-1.0055-2.6422,0-3.6484l0.9277-0.9269c0.21449-0.21449,0.56295-0.21449,0.77745,0,0.21449,0.21449,0.21449,0.56296,0,0.77745l-0.9277,0.9276c-0.57716,0.57716-0.57716,1.5163,0,2.0935,0.27945,0.27945,0.65092,0.43372,1.0467,0.43372,0.39583,0,0.7673-0.15427,1.0467-0.43372l2.03-2.0296c0.57716-0.57716,0.57716-1.5163,0-2.0935-0.21449-0.21449-0.21449-0.56296,0-0.77745s0.56295-0.21449,0.77745,0c1.0055,1.0055,1.0055,2.6422,0,3.6484l-2.0299,2.03c-0.4872,0.487-1.1354,0.755-1.8242,0.755z"/></svg>)
  }

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
        {this.svgs[channel]}
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
            <h3>{this.props.address}</h3>
          </header>
          {this.renderImage()}
          <p dangerouslySetInnerHTML={this.rawReview()} />
          {this.renderPrice()}
          {this.renderTags()}
          <div className="venues-overlay__divider">
            <hr/>
          </div>
          {this.renderSocial()}
          <div className="venues-overlay__divider">
            <hr/>
          </div>
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
