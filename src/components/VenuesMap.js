import React, {Component, PropTypes} from 'react'
import { Map, MapComponent, Marker, Popup, TileLayer } from 'react-leaflet'
import { fetchVenuesIfNeeded } from '../actions'

class VenuesMap extends Component {

	constructor(props) {
		super(props)
    this.handleMoveEnd = this.handleMoveEnd.bind(this)
	}

  handleMoveEnd(e) {
    const { dispatch } = this.props
    const map = this.refs.map.leafletElement
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
      <Map
        ref="map"
        zoomControl={"false"}
        className="venues__map"
        center={this.props.startPosition}
        onLeafletMoveend={this.handleMoveEnd}
        zoom={15}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={this.props.startPosition}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    )
  }
}

VenuesMap.propTypes = {
  dispatch: PropTypes.func.isRequired
}

VenuesMap.defaultProps = {
  startPosition: [51.505, -0.09]
}

export default VenuesMap
