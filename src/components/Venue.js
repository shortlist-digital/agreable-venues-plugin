import React, {Component, PropTypes} from 'react';

const classNames = require('classnames')

class Venue extends Component {

  renderImage() {
    return <div className="venue-overlay__img">
      <img src={this.props.images[0].landscape.url} title={this.props.name} />
      </div>
  }

  renderSocial(url){
    return null
  }

  renderWebsite(url){
    return url ? (
      <a href={this.props.website} title={this.props.name}>Website</a>
    ) : null
  }

  renderPrice(price){

    if(!price) {
      return null
    }

    const max = 4
    const ints = new Array(...Array(max))

    return (
      <div className='venue-price'>
        {ints.map((x, i) => {
          const priceClass = classNames({
            'venue-price__symbol': true,
            'venue-price__symbol--active': (i<=parseInt(price))
          });
          return (<span className={priceClass} key={i}>{i}</span>)
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
        </header>
        { (Object.keys(this.props.images).length > 0) ? this.renderImage() : null}
        <p>{this.props.review}</p>
        {this.renderWebsite(this.props.website)}
        {this.renderSocial()}
        {this.renderPrice(this.props.price)}
      </div>
    );
  }
}


export default Venue;
