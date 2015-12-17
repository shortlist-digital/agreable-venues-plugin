import ReactDOMServer from 'react-dom/server'
import React, { Component, PropTypes } from 'react'
import Leaflet from 'leaflet'
import { MapLayer } from 'react-leaflet'

require('leaflet.markercluster')

class MarkerCluster extends MapLayer {

  constructor(props){
    super(props)
  }

  handleMarkerClick(objectId, venue) {
    if(`/${venue.slug}` != this.props.pathname){
      this.props.pushState({}, `/${venue.slug}`)
    }
  }

  componentWillMount() {
    super.componentWillMount()
    this.leafletElement = Leaflet.markerClusterGroup()
  }

  shouldComponentUpdate(nextProps) {
    // Only update if we have more venues in memory.
    return nextProps.venues.size > this.props.venues.size
  }

  componentWillUpdate(nextProps) {
    super.componentWillReceiveProps(nextProps)

    // Filter out only new venues.
    const newVenues = Array.from(nextProps.venues)
      .filter((obj) => {
        return !this.props.venues.has(obj[0])
      })

    const newMarkers = []
    newVenues.forEach((obj) => {
      // ES6 Map has been converted to Array: ['objectId', venueObj]
      const venue = obj[1]

      const options = {}
      if(venue.images && Object.keys(venue.images).length){
        // Custom icon.
        options.icon = Leaflet.icon({
          classname: "icon-marker",
          iconAnchor: [0, 0],
          iconSize: [60, 60],
          iconUrl: venue.images[0].thumbnail.url,
          popupAnchor: [40, 0]
        })
      }

      // Add marker.
      const l = venue.location
      const leafletMarker = Leaflet.marker(l, options)
        .on('click', (e) => {
          this.handleMarkerClick(...obj)
        })

      newMarkers.push(leafletMarker)
    })

    // Add all markers to cluster layer.
    this.leafletElement.addLayers(newMarkers)
  }

  render() {
    return null
  }
}

MarkerCluster.propTypes = {
  pathname: PropTypes.string.isRequired,
  pushState: PropTypes.func.isRequired,
  venues: PropTypes.object.isRequired,
};

MarkerCluster.defaultProps = {
  markers: {},
  venues: PropTypes.object.isRequired
};

export default MarkerCluster;
