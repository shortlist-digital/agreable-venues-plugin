import React, {Component, PropTypes} from 'react';
import { pushState } from 'redux-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchLocation } from '../actions';

import Search from '../components/Search';

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { searchLocationAction, currentSearch } = this.props;
    const links = [
      '/',
      '/a-test-venue',
      '/another-test-venue',
    ].map(l =>
      <p>
        <Link to={l}>{l}</Link>
      </p>
    );

    return (
      <div>
        <h1>Venues (Search term:{currentSearch})</h1>
        <Search
          searchTerm={currentSearch}
          onSearch={value =>
            searchLocationAction(value)
          } />
        {this.props.children}
				<h3>Test links</h3>
        {links}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentSearch: state.venues.searchTerm
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchLocationAction: bindActionCreators(searchLocation, dispatch),
    pushState
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
