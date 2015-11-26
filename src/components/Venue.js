import React, {Component, PropTypes} from 'react';

class Venue extends Component {

  renderImage() {
    return <div className="venues__venue__img">
      <img src={this.props.images[0].landscape.url} title={this.props.name} />
      </div>
  }

  render() {
    return (
      <div className='venues__venue'>
        <h2>{this.props.name}</h2>
        <p>{this.props.address}</p>
        { (Object.keys(this.props.images).length > 0) ? this.renderImage() : null}
        <p>{this.props.review}</p>
      </div>
    );
  }
}


export default Venue;
