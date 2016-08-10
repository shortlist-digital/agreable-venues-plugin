import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import InlineSVG from 'svg-inline-react/lib';
import request from 'superagent';
import legacyIESupport from 'superagent-legacyIESupport';
import CalaisClient from 'calais-js-client';
const classNames = require('classnames')

import VenueShare from './VenueShare'
import ClosestVenues from './ClosestVenues'

const PASSPORT_SECRET = "98ffcfb9435d732db12315f980718d4aee7179b3edb89e1acf904975dab6e7af";
const PASSPORT_ID = "mrhyde_event_national-burger-day-2016";

class Venue extends Component {

  constructor(props){
    super(props)
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.calaisClient = new CalaisClient(PASSPORT_ID, PASSPORT_SECRET);
  }

  setComponentState(props) {
    this.state = {
      firstName: null,
      lastName: null,
      emailAddress: null,
      restaurantCode: this.makeId(),
      restaurantName: props.name,
      restaurantSlug: props.slug,
      restaurantId: props.post_id,
      restaurantTerms: '',
      restaurantLink: 'https://nationalburgerday.co.uk/' + window.__INITIAL_STATE__.app.map.slug + '/' + props.slug,
      restaurantWebsite: props.contact.website,
      restaurantAddress: props.info.address,
      thirdPartyOptInMessage: props.promotion.promo_third_party_message || null,
      thirdPartyOptIn: null,
      location: window.location.pathname
    };
  }

  makeId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.post_id !== this.props.post_id) || (nextProps.closestVenues !== this.props.closestVenues);
  }

  componentDidUpdate() {
    // move the window to the top
    let overlay = document.querySelector('.venues-overlay')
    overlay.scrollTop = 0;
  }

  componentWillReceiveProps(nextProps) {
    // set next state
    this.setComponentState(nextProps);
  }

  handleClose(e){
    this.props.pushState({}, '/')
  }

  handleFormSubmit(e) {
    e.preventDefault()
    e.stopPropagation()

    let form = e.currentTarget;

    // if there is an opt in check box
    if (this.props.promotion.promo_third_party) {
      // set the opt in data
      this.checkOptIn(form.querySelector('#third-party-optin'));
    }

    // validate fields
    this.validateEmail(form.querySelector('#email'));
    this.validateFirstName(form.querySelector('#firstname'));
    this.validateLastName(form.querySelector('#lastname'));

    // if all fields are valid
    if (form.querySelectorAll('.is-error').length < 1) {
      this.sendVoucher();
      this.saveEmail();
    }
  }

  validateEmail(input) {
    let value = input.value;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(value)) {
      // remove error class
      input.classList.remove('is-error');

      // set state
      this.state.emailAddress = value;
    } else {
      // set error class
      input.classList.add('is-error');
    }
  }

  validateLastName(input) {
    let value = input.value;

    if (value.length) {
      // remove error class
      input.classList.remove('is-error');

      // set state
      this.state.lastName = value;
    } else {
      // set error class
      input.classList.add('is-error');
    }
  }

  validateFirstName(input) {
    let value = input.value;

    if (value.length) {
      // remove error class
      input.classList.remove('is-error');

      // set state
      this.state.firstName = value;
    } else {
      // set error class
      input.classList.add('is-error');
    }
  }

  checkOptIn(input) {
    // save state user opt in to third party
    this.state.thirdPartyOptIn = input.checked;
  }

  sendVoucher() {
    // push the data to generate the voucher
    request.post('https://nbd-voucher.herokuapp.com/send')
      .use(legacyIESupport)
      .set('content-type', 'application/json')
      .send(JSON.stringify(this.state))
      .end(function(err, res) {
    });
  }

  saveEmail() {
    let payload = {
      emailAddress: this.state.emailAddress,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      restaurantName: this.state.restaurantName,
      restaurantId: this.state.restaurantId,
      restaurantSlug: this.state.restaurantSlug,
      thirdPartyOptIn1Key: this.state.thirdPartyOptInMessage,
      thirdPartyOptIn1Value: this.state.thirdPartyOptIn,
      location: this.state.location
    }

    // push data to calais
    this.calaisClient.setDataRecord(payload);
    this.calaisClient.post().then(this.handlePostSuccess).catch(this.handlePostFailure);
  }

  handlePostSuccess(error, response) {
    let form = document.querySelector('#voucher-form');
    let msg = form.nextSibling;

    // hide the form
    form.style.display = 'none';

    // show the message
    msg.style.display = 'block';
  }

  handlePostFailure(error, response) {
    // not ideal...
    this.handlePostSuccess();
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
      case 'content-only':
        link = <span>{url}</span>
        break
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
    if (!this.props.info.address &&
      !this.props.contact.instagram &&
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
        {(this.props.info.address) ?
          this.renderSocialItem('content-only', this.props.info.address):null }
      </div>
    )
  }

  renderVoucher() {
    if (!window.__INITIAL_STATE__.app.display_vouchers) {
      return null;
    }

    return (
      <div className="venues-voucher">
        <h2>Get 20% off at { this.props.name }</h2>
        <p>Vouchers may take up to an hour to arrive. Please check your spam folder if it doesn't turn up.</p>
        <form id="voucher-form" onSubmit={this.handleFormSubmit}>
          <div className="form-row">
            <label className="visually-hidden" htmlFor="firstname">First name (required)</label>
            <input id="firstname" name="firstname" placeholder="First name" type="text" />
          </div>
          <div className="form-row">
            <label className="visually-hidden" htmlFor="lastname">Last name (required)</label>
            <input id="lastname" name="lastname" placeholder="Last name" type="text" />
          </div>
          <div className="form-row">
            <label className="visually-hidden" htmlFor="email">Email address (required)</label>
            <input id="email" name="email" placeholder="e.g. lisa@gmail.com" type="email" />
          </div>
          <div className="form-row form-row--submit">
            <button type="submit">Get voucher</button>
          </div>
          <p className="form-row">By entering your details to claim your Mr Hyde National Burger Day voucher you will automatically be signed up to Mr Hyde, the daily email for men covering film, style, culture and places to eat meat. <a href="/website-terms-and-conditions-of-use">Terms & Conditions</a></p>
          {this.props.promotion.promo_third_party == '1' ?
            <div className="form-row form-row--option">
              <input id="third-party-optin" name="third-party-optin" type="checkbox" />
              <label htmlFor="third-party-optin">{ this.props.promotion.promo_third_party_message }</label>
            </div>
          :
            null
          }
        </form>
        <p className="thank-you-msg">Thank you! Your voucher is on its way!</p>
      </div>
    );
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
          {this.renderVoucher()}
          {this.renderPrice()}
          {this.renderTags()}
          {this.renderSocial()}
          <VenueShare
            {...this.props.site}
            name={this.props.name}
            review={this.props.info.review}
            image={Object.keys(this.props.images).length
              ? this.props.images[0] : null } />
          <ClosestVenues venues={this.props.closestVenues} parentSlug={this.props.slug} displayLocation="overlay" pushState={this.props.pushState} />
        </div>
      </div>
    );
  }
}

Venue.propTypes = {
  post_id: PropTypes.number.isRequired,
  pushState: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  contact: PropTypes.object.isRequired,
  VenueTypes: PropTypes.array,
  images: PropTypes.object.isRequired,
  price: PropTypes.string,
  Tags: PropTypes.array,
  promotion: PropTypes.object,
}

Venue.defaultProps = {
  images: {}
}

export default Venue;
