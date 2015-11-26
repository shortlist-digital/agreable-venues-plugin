import React, { Component, PropTypes } from 'react'
import { Map as LeafletMap, MapComponent, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerCluster from './MarkerCluster'

import * as config from '../constants/Config'

class Map extends Component {

  constructor(props) {
    super(props)
    this.handleMoveEnd = this.handleMoveEnd.bind(this)
    this.handleLocationFound = this.handleLocationFound.bind(this)
  }

  handleLocationFound(e) {
    const map = this.refs.map.leafletElement
    // Remove event handler
    map.off('locationfound', this.handleLocationFound)

    this.props.onGeolocateSuccess()
  }

  handleMoveEnd(e) {
    const { fetchMarkers } = this.props
    const map = this.refs.map.leafletElement
    // TODO: Consider passing them as simple array rather than object
    // that is incompatible with Parse GeoPoints. Can use spread syntax then.
    // const boundsObj = map.getBounds()
    // const bounds = Object.keys(boundsObj).map((k) => boundsObj[k])
    fetchMarkers(map.getBounds())
  }

  componentWillReceiveProps(nextProps) {
    const { bounds, isLocating } = this.props
    const map = this.refs.map.leafletElement

    const ne = nextProps.bounds.northeast
    const sw = nextProps.bounds.southwest

    // Change bounds based on `bounds` property. Set after
    // location search.
    if(ne.lat && sw.lat && !Object.is(bounds, nextProps.bounds)){
      map.fitBounds([
          [ne.lat, ne.lng],
          [sw.lat, sw.lng]
      ])
    }

    // If geolocation activated.
    if(nextProps.isLocating == true && isLocating == false){
      map.on('locationfound', this.handleLocationFound)
      map.locate({
        setView: true
      })
    }

    // If focusPoint is changed.
    if(JSON.stringify(nextProps.focusLocation) !== JSON.stringify(this.props.focusLocation)){
      map.setView(nextProps.focusLocation, config.MAP_MAX_ZOOM)
    }
  }

  componentDidMount() {
    const { fetchMarkers, activeVenue } = this.props
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

    if(!activeVenue){
      // Initial get from Parse.
      fetchMarkers(map.getBounds())
    }

    // map.on('click',
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
          venues={this.props.venues}
          pushState={this.props.pushState}>
        </MarkerCluster>
      </LeafletMap>
    )
  }
}

Map.propTypes = {
  pushState: PropTypes.func.isRequired,
  isLocating: PropTypes.bool.isRequired,
  bounds: PropTypes.object,
  markerLatLng: PropTypes.array,
  startPosition: PropTypes.array,
  venues: PropTypes.object.isRequired
}

Map.defaultProps = {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  tileURL: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  startPosition: [51.505, -0.09],
  maxZoom: config.MAP_MAX_ZOOM,
  minZoom: config.MAP_MIN_ZOOM,
  zoom: config.MAP_INIT_ZOOM
}

export default Map
