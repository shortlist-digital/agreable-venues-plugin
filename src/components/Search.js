import React, {Component, PropTypes} from 'react';

class Search extends Component {

  constructor(props) {
    super(props);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
  }

  handleOnKeyPress(e) {
    if (e.charCode === 13) {
      const value = e.currentTarget.value.trim();
      if (value !== '') {
        this.props.onSearch(value)
      }
    }
  }

  render() {
    const {searchTerm} = this.props
    const current = searchTerm ? <p>Currently showing: {this.props.searchTerm}</p> : "";

    return (
        <div className='search'>
          <div className='toolbar-items'>
            <input placeholder='SEARCH' onKeyPress={this.handleOnKeyPress} type='text' />
          </div>
          {current}
        </div>
    );
  }
}

export default Search;
