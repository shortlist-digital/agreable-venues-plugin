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
    return encodeURIComponent(`Take a look at ${this.props.name} on the ${this.props.sitename} Map.`)
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
        <h2>Share your love for this venue:</h2>
        <ul>
          <li className="venues-share__network venues-share__network--facebook">
            <a onClick={this.handleFacebook} href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}>
              <InlineSVG src={require('!svg-inline!../svgs/facebook.svg')} />
            </a>
          </li>
          <li className="venues-share__network venues-share__network--twitter">
            <a onClick={this.handleTwitter} href={`https://twitter.com/intent/tweet?url=${currentUrl}`}>
              <InlineSVG src={require('!svg-inline!../svgs/twitter.svg')} />
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
