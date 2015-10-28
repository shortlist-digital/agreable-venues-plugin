import React, { Component, PropTypes } from 'react'
import { Map as LeafletMap, MapComponent, Marker, Popup, TileLayer } from 'react-leaflet'
import { fetchVenuesIfNeeded } from '../actions'
import MarkerCluster from './MarkerCluster'

class Map extends Component {

  constructor(props) {
    super(props)
    this.handleMoveEnd = this.handleMoveEnd.bind(this)
  }

  handleMoveEnd(e) {
    const { dispatch } = this.props
    const map = this.refs.map.leafletElement
    // TODO: Consider passing them as simple array rather than object
    // that is incompatible with Parse GeoPoints. Can use spread syntax then.
    // const boundsObj = map.getBounds()
    // const bounds = Object.keys(boundsObj).map((k) => boundsObj[k])
    dispatch(fetchVenuesIfNeeded(map.getBounds()))
  }

  componentDidMount() {
    const { dispatch } = this.props
    const map = this.refs.map.leafletElement

    // Manually remove top left zoom control because
    // constructor param (zoomControl:false) is not working
    // through react component as far as I can see.
    const firstZoomControl = map._controlContainer.firstChild
    firstZoomControl.parentNode.removeChild(firstZoomControl)

    const zoomControl = L.control.zoom({
      position: 'bottomleft'
    })
    map.addControl(zoomControl)
    // Initial get from Parse.
    dispatch(fetchVenuesIfNeeded(map.getBounds()))
  }

  render() {
    return (
      <LeafletMap
        ref="map"
        className="venues__map"
        center={this.props.startPosition}
        onLeafletMoveend={this.handleMoveEnd}
        zoom={this.props.zoom}>
        <TileLayer
					maxZoom={this.props.maxZoom}
					minZoom={this.props.minZoom}
          url={this.props.tileURL}
          attribution={this.props.attribution}
        />
				<MarkerCluster
					venues={this.props.venues}>
				</MarkerCluster>
      </LeafletMap>
    )
  }
}

Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  startPosition: PropTypes.array,
  venues: PropTypes.object.isRequired,
	onLeafletMoveEnd : PropTypes.func.isRequired
}

Map.defaultProps = {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	tileURL: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  startPosition: [51.505, -0.09],
	maxZoom: 16,
	minZoom: 3,
	zoom: 15
}

export default Map
