import React, {Component, PropTypes} from 'react';
import facebookSetup from '../utils/FacebookSetup'
import InlineSVG from 'svg-inline-react/lib';

const classNames = require('classnames')

class VenueShare extends Component {

  constructor(props){
    super(props)
    facebookSetup()
    this.handleFacebook = this.handleFacebook.bind(this);
    this.handleTwitter = this.handleTwitter.bind(this);
  }

  tweetText(){
    let name = this.props.name
    // Using html element to encode url
    const el = document.createElement('p')
    el.innerHTML = name
    return encodeURIComponent(`Take a look at ${el.textContent} on the ${this.props.sitename} Map.`)
  }

  handleTwitter(e){
    e.preventDefault()
    var url = `https://twitter.com/intent/tweet?text=${this.tweetText()}&url=${window.location.href}`
    window.open(url, '', 'height=300,width=600')
  }

  handleFacebook(e) {
    e.preventDefault()
    FB.ui({
      method: 'share',
      href: window.location.href.replace('local', 'staging'),
    }, function(response){})
  }

  render() {
    const currentUrl = window.location;
    return (
      <div className="venues-share">
        <h2>Share this venue:</h2>
        <ul className="venues-share__network-wrapper">
          <li className="venues-share__network venues-share__network--facebook">
            <a onClick={this.handleFacebook} href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}>
              <InlineSVG src={require('!svg-inline-loader!../svgs/facebook.svg')} />
            </a>
          </li>
          <li className="venues-share__network venues-share__network--twitter">
            <a onClick={this.handleTwitter} href={`https://twitter.com/intent/tweet?url=${currentUrl}`}>
              <InlineSVG src={require('!svg-inline-loader!../svgs/twitter.svg')} />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

VenueShare.propTypes = {
  name: PropTypes.string.isRequired,
  review: PropTypes.string.isRequired,
  sitename: PropTypes.string.isRequired,
}

VenueShare.defaultProps = {
}

export default VenueShare;
