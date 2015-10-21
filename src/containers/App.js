import React, {Component, PropTypes} from 'react';
import { pushState } from 'redux-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchLocation } from '../actions';

import Search from '../components/Search';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

	_renderMap() {
		const position = [51.505, -0.09];
		return (
			<Map className="venues__map" center={position} zoom={13}>
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={position}>
					<Popup>
						<span>A pretty CSS3 popup.<br/>Easily customizable.</span>
					</Popup>
				</Marker>
			</Map>
		);
	}

  render() {
    const { searchLocationAction, currentSearch } = this.props;
    const links = [
      '/',
      '/a-test-venue',
      '/another-test-venue',
    ].map(l =>
      <p>
        <Link to={l}>{l}</Link>
      </p>
    );

    return (
      <div>
		{this._renderMap()}
        <h1>Venues (Search term:{currentSearch})</h1>
        <Search
          searchTerm={currentSearch}
          onSearch={value =>
            searchLocationAction(value)
          } />
        {this.props.children}
				<h3>Test links</h3>
        {links}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentSearch: state.venues.searchTerm
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchLocationAction: bindActionCreators(searchLocation, dispatch),
    pushState
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
