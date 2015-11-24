import ReactDOMServer from 'react-dom/server'
import React, { Component, PropTypes } from 'react'
import Leaflet from 'leaflet'
import { MapLayer } from 'react-leaflet'
import MarkerPopup from './MarkerPopup'

require('leaflet.markercluster')

class MarkerCluster extends MapLayer {

  handleMarkerClick(objectId, venue) {
    this.props.pushState({}, `/${venue.slug}`)
  }

  componentWillMount() {
    super.componentWillMount()

    this.leafletElement = Leaflet.markerClusterGroup()
  }

  // Called everytime this component receives new properties
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps)

    // If we have new venues to add.
    if(nextProps.venues.size > this.props.venues.size){

      // Filter out only new venues.
      const newVenues = Array.from(nextProps.venues)
        .filter((obj) => {
          return !this.props.venues.has(obj[0])
        })

      const newMarkers = []
      newVenues.forEach((obj) => {
        // ES6 Map has been converted to Array: ['objectId', venueObj]
        const objectId = obj[0]
        const venue = obj[1]
        // Store component as markup for rendering in convetional
        // leaflet manner.
        let markerPopup = ReactDOMServer.renderToString(
          <MarkerPopup
            objectId={objectId}
            name={venue.name}
            image={(venue.images) ? venue.images[0] : null}
            url={`${this.props.basename}/${venue.slug}`}
            basename={this.props.basename}
            slug={venue.slug} />
        )

        // Add marker.
        const l = venue.location
        const leafletMarker = Leaflet.marker([l.latitude, l.longitude])
          .bindPopup(markerPopup, {
            maxHeight: 350,
            maxWidth: 250,
            minWidth: 250
          })
          .on('click', (e) => {
            this.handleMarkerClick(...obj)
          })

        newMarkers.push(leafletMarker)
      })

      // Add all markers to cluster layer.
      this.leafletElement.addLayers(newMarkers)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return null
  }
}

MarkerCluster.propTypes = {
  pushState: PropTypes.func.isRequired,
  venues: PropTypes.object.isRequired,
  basename: PropTypes.string.isRequired
};

MarkerCluster.defaultProps = {
  markers: {},
  venues: PropTypes.object.isRequired
};

export default MarkerCluster;
