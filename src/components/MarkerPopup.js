import React, {Component, PropTypes} from 'react'
import { pushState } from 'redux-router'

class MarkerPopup extends Component {
  _getStyles() {
    return {
      clear: {
        content: ' ',
        clear: 'both',
        display: 'table'
      },
      link: {
        wordWrap: 'break-word',
      },
      img: {
        display: 'block',
        float: 'right',
        height: 150
      },
    };
  }

  handleClick(e) {

    console.log(pushState)
    e.preventDefault()
    pushState({}, this.props.url)

    // dispatch(openVenue(this.props.objectId))
    return false
  }

  render() {
    const styles = this._getStyles();
    const image = this.props.image
      ? <img src={this.props.image.square.url} style={styles.img} />
      : ''

    return (
      <div>
       <a onClick={this.handleClick}>
        {this.props.name}
       </a>
        <span style={styles.clear} />
        {image}
        <span style={styles.clear} />
      </div>
    );
  }
}

MarkerPopup.propTypes = {
  name: PropTypes.string,
  image: PropTypes.object,
  url: PropTypes.string,
};

export default MarkerPopup;
