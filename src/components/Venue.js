import React, {Component, PropTypes} from 'react';

class Venue extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className='venues__venue'>
        <h2>Venue {this.props.params.name}</h2>
      </div>
    );
  }
}


export default Venue;
