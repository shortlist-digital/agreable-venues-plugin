import ReactDOMServer from 'react-dom/server'
import React, { Component, PropTypes } from 'react'
import Leaflet from 'leaflet'
import { MapLayer } from 'react-leaflet'
import MarkerPopup from './MarkerPopup'

require('leaflet.markercluster')

class MarkerCluster extends MapLayer {

  componentWillMount() {
    super.componentWillMount()

    this.leafletElement = Leaflet.markerClusterGroup()
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps)

    // Add markers to cluster layer
    if(nextProps.venues.size > this.props.venues.size){

      let markers = Object.assign({}, this.props.markers)
      const newVenues = Array.from(nextProps.venues)
        .filter((obj) => {
          return !this.props.venues.has(obj[0])
        })

      const newMarkers = []
      newVenues.forEach((obj) => {
        const objectId = obj[0]
        const venue = obj[1]
        let markerPopup = ReactDOMServer.renderToStaticMarkup(
					<MarkerPopup
						caption={venue.name}
					/>
        )

        const l = venue.location
        const leafletMarker = Leaflet.marker([l.latitude, l.longitude])
          .bindPopup(markerPopup, {
            maxHeight: 350,
            maxWidth: 250,
            minWidth: 250
          })
          // .on('click', () => this.props.map.panTo([l.latitude, l.longitude]))

        markers[objectId] = leafletMarker
        newMarkers.push(leafletMarker)
      });

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
  venues: PropTypes.object.isRequired
};

MarkerCluster.defaultProps = {
  markers: {},
  venues: PropTypes.object.isRequired
};

export default MarkerCluster;
