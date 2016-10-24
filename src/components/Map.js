import React, { Component, PropTypes } from 'react'
import { Map as LeafletMap, MapComponent, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerCluster from './MarkerCluster'

import * as config from '../constants/Config'

class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      locationLat: 51.507,
      locationLon: -0.128,
      locationName: true
    }
    this.handleMoveEnd = this.handleMoveEnd.bind(this)
    this.handleLocationFound = this.handleLocationFound.bind(this)
  }

  getDefaultLocation() {
    let url = window.location.search.substr(1);
    let locationName = url.match(/l=([^&]*)/);
    if (locationName === null||'undefined') {
      this.setState({locationName: false})
      return
    }
    if (locationName === true) {
      for (let loc of this.props.locationDetails) {
        if (loc.location_name.toLowerCase() === locationName[1]) {
          this.setState({locationLat: loc.location_latitude})
          this.setState({locationLon: loc.location_longitude})
        }
      }
    }
  }

  getDistanceFromZoom(map, mapCenter) {
    var pointC = map.latLngToContainerPoint(mapCenter); // convert to containerpoint (pixels)
    var pointX = [pointC.x + 1, pointC.y]; // add one pixel to x
    var pointY = [pointC.x, pointC.y + 1]; // add one pixel to y

    // convert containerpoints to latlng's
    var latLngC = map.containerPointToLatLng(pointC);
    var latLngX = map.containerPointToLatLng(pointX);

    var distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)

    return distanceX * 2;
  }

  handleLocationFound(e) {
    const map = this.refs.map.leafletElement
    // Remove event handler
    map.off('locationfound', this.handleLocationFound)

    this.props.onGeolocateSuccess()

    // setTimeout(function() {
      let mapCenter = map.getCenter();

      this.props.panToLocation({
        lat: mapCenter.lat,
        lng: mapCenter.lng
      }, 'search');
    // }, 2000);
  }

  handleMoveEnd(e) {
    const { fetchMarkers } = this.props
    const map = this.refs.map.leafletElement

    let mapCenter = map.getCenter();

    fetchMarkers({
      lat: mapCenter.lat,
      lng: mapCenter.lng
    }, this.getDistanceFromZoom(map, mapCenter));

    // removing this as Android Chrome triggers a resize when you focus the search input
    // the subsequent map move and trigger of this function blurs the input immediately.
    // // Blur focus on textfield if it's currently active.
    // if(document.activeElement.type === 'text'){
    //   document.activeElement.blur()
    // }
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
      this.setViewOffset(nextProps.focusLocation, map)
    }

    // If pathname has changed to '/' (root) then click
    // map to remove any popups
    if(nextProps.pathname == '/' &&
      nextProps.pathname != this.props.pathname){
        // 'preclick' event closes all open popups.
        this.refs.map.leafletElement.fire('preclick')
    }
  }

  componentDidMount() {
    const { fetchMarkers, hasVenueRoute } = this.props
    const map = this.refs.map.leafletElement

    this.getDefaultLocation()

    if (!hasVenueRoute) {
      // Initial data fetch from Firebase.
      let mapCenter = map.getCenter();

      fetchMarkers({
        lat: mapCenter.lat,
        lng: mapCenter.lng
      }, this.getDistanceFromZoom(map, mapCenter));
    }

    map.on('click', () => {
      this.props.pushState({}, '/')
      // Updates state through reducer.
      this.props.setVenueInactive()
    })
  }

  setViewOffset(latLng, map){

    const overlayWidth = 360
    const targetPoint = map.project(latLng, config.MAP_MAX_ZOOM)
                           .add([overlayWidth / 2, 0]);
    const targetLatLng = map.unproject(targetPoint, config.MAP_MAX_ZOOM);
    map.setView(targetLatLng, config.MAP_MAX_ZOOM)
  }

  render() {
    return (
      <LeafletMap
        ref="map"
        attributionControl={false}
        className="venues__map"
        center={[this.state.locationLat,this.state.locationLon]}
        onLeafletMoveend={this.handleMoveEnd}
        zoom={this.props.zoom}
        scaleControl={true}>
        <TileLayer
          maxZoom={this.props.maxZoom}
          minZoom={this.props.minZoom}
          url={this.props.tileUrl}
          token={this.props.mapboxToken}
          mapId={this.props.mapboxMapId}
        />
        <MarkerCluster
          pathname={this.props.pathname}
          venues={this.props.venues}
          pushState={this.props.pushState}>
        </MarkerCluster>
      </LeafletMap>
    )
  }
}

Map.propTypes = {
  pathname: PropTypes.string.isRequired,
  pushState: PropTypes.func.isRequired,
  panToLocation: PropTypes.func.isRequired,
  isLocating: PropTypes.bool.isRequired,
  bounds: PropTypes.object,
  markerLatLng: PropTypes.array,
  startPosition: PropTypes.array,
  locationDetails: PropTypes.array,
  venues: PropTypes.object.isRequired,
  tileUrl : PropTypes.string.isRequired,
  mapboxToken : PropTypes.string,
  mapboxMapId : PropTypes.string
}

Map.defaultProps = {
  maxZoom: config.MAP_MAX_ZOOM,
  minZoom: config.MAP_MIN_ZOOM,
  zoom: config.MAP_INIT_ZOOM
}

export default Map
