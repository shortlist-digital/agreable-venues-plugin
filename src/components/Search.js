import React, {Component, PropTypes} from 'react';

class Search extends Component {

  constructor(props) {
    super(props);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault()
    const value = this.refs.locationInput.value.trim()
    this.props.onImmediateSearch(value)
  }

  handleOnKeyUp(e) {
    const value = e.currentTarget.value.trim()
    e.preventDefault()

    if (value !== '') {
      this.props.onDebounceSearch(value)
    }
  }

  render() {
    const { searchTerm, isLocating, onGeolocate } = this.props

    return (
        <div className='venues-search'>
          <form onSubmit={this.handleSubmit}>
            <input placeholder='Enter a location' ref="locationInput" onKeyUp={this.handleOnKeyUp} type='text' />
            <div className="venues-search__icon">
              <svg version="1.1" width="512" height="512" viewBox="0 0 512 512">
                <path d="M496.131 435.698l-121.276-103.147c-12.537-11.283-25.945-16.463-36.776-15.963 28.628-33.534 45.921-77.039 45.921-124.588 0-106.039-85.961-192-192-192s-192 85.961-192 192 85.961 192 192 192c47.549 0 91.054-17.293 124.588-45.922-0.5 10.831 4.68 24.239 15.963 36.776l103.147 121.276c17.661 19.623 46.511 21.277 64.11 3.678s15.946-46.449-3.677-64.11zM192 320c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.307 128-128 128z"></path>
              </svg>
            </div>
          </form>
          <small>
            <a disabled={isLocating} onClick={onGeolocate} className='venues-search__locateme'>Find my location</a>
          </small>
        </div>
    );
  }
}

Search.defaultProps = {
  isLocating: false
}

export default Search;
