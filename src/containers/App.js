import React, {Component, PropTypes} from 'react';
import { pushState } from 'redux-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchLocation } from '../actions';

import Search from '../components/Search';
import { Map, MapComponent, Marker, Popup, TileLayer } from 'react-leaflet';

class App extends Component {

	constructor(props) {
		super(props)
    this.handleMoveEnd = this.handleMoveEnd.bind(this);
	}

  static propTypes = {
    children: PropTypes.node
  }

  handleMoveEnd(e) {
    const map = this.refs.map.leafletElement
		console.log(map.getBounds())
  }

  componentDidMount() {
    const map = this.refs.map.leafletElement

    // Manually remove top left zoom control because
    // constructor param (zoomControl:false) is not working
    // through react component.
    const firstZoomControl = map._controlContainer.firstChild
    firstZoomControl.parentNode.removeChild(firstZoomControl)

    const zoomControl = L.control.zoom({
      position: 'bottomleft'
    });
    map.addControl(zoomControl);
  }

  _renderMap() {
    const position = [51.505, -0.09];

    const map = (
      <Map
        ref="map"
        zoomControl={"false"}
        className="venues__map"
        center={position}
        onLeafletMoveend={this.handleMoveEnd}
        zoom={15}>
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
    return map
  }

  render() {
    const { searchLocationAction, currentSearch } = this.props;
    const links = [
      '/',
      '/a-test-venue',
      '/another-test-venue',
    ].map(l =>
      <div>
        <Link to={l}>{l}</Link>
      </div>
    );

    return (
      <div>
        {this._renderMap()}
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
