import React, {Component, PropTypes} from 'react';

class Search extends Component {

  constructor(props) {
    super(props);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
  }

  handleOnKeyPress(e) {
    const value = e.currentTarget.value.trim();
    if (value !== '') {
      this.props.onSearch(value)
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
            <input placeholder='SEARCH' onKeyPress={this.handleOnKeyPress} type='text' />
          </div>
          {current}
        </div>
    );
  }
}

Search.defaultProps = {
}

export default Search;
