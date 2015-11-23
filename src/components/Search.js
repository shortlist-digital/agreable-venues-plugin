import React, {Component, PropTypes} from 'react';

class Search extends Component {

  constructor(props) {
    super(props);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
  }

  handleOnKeyUp(e) {
    const value = e.currentTarget.value.trim()

    if (value !== '') {
      this.props.onDebounceSearch(value)

      if(e.charCode == '13'){
        this.props.onImmediateSearch(value)
      }
    }
  }

  render() {
    const { searchTerm } = this.props
    const current = searchTerm
     ? <p>Currently showing: {this.props.searchTerm}</p>
     : "";

    return (
        <div className='venues__search'>
          <div>
            <input placeholder='SEARCH' onKeyUp={this.handleOnKeyUp} type='text' />
          </div>
          {current}
        </div>
    );
  }
}

Search.defaultProps = {
}

export default Search;
