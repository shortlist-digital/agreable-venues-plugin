require('es6-object-assign').polyfill()
require('./stylus/main.styl')

import DOMReady from 'detect-dom-ready'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'
import firebase from 'firebase'
import GeoFire from 'geofire'

// Conditionally requiring store dependant on env. __PRODUCTION__ variable
// defined in webpack conf.

// Using require instead of import below so that minifying
// extracts dead code correctly.

let store = null
if (__PRODUCTION__) {
  store = require('./store/configureStore.prod')();
} else {
  store = require('./store/configureStore.dev')();
  // Create seperate dev tool window rather than docked.
  require('./createDevToolsWindow')(store);
}

// Initialize the Firebase SDK
var firebaseConfig = {
  apiKey: "AIzaSyBTJAJMSpkPjEPbWkrlphZ4FQ1bsJum0eY",
  authDomain: "venues-database.firebaseapp.com",
  databaseURL: "https://venues-database.firebaseio.com",
  storageBucket: "venues-database.appspot.com",
};
firebase.initializeApp(firebaseConfig);
var firebaseRef = firebase.database().ref('venues/_geofire');
// firebaseRef.on('child_added', function(data) {
//   console.log('child_added', data);
// });
var geoFire = new GeoFire(firebaseRef);
// geoFire.get('Chuck Burger').then(function(location) {
//   console.log(location);
// });
geoFire.set("TEST_Chucks", [51.5157496, -0.071967699999959]).then(function() {
  console.log("Provided key has been added to GeoFire");
}, function(error) {
  console.log("Error: " + error);
});
geoFire.set("TEST_Park", [51.5082341, -0.14335329999994]).then(function() {
  console.log("Provided key has been added to GeoFire");
}, function(error) {
  console.log("Error: " + error);
});

setTimeout(function() {
  var geoQuery = geoFire.query({
    center: [51.5283064, -0.3824583],
    radius: 1000
  });
  geoQuery.on('key_entered', function(key, location, distance) {
    console.log('key_entered', key, location, distance);
  });
  geoQuery.on('key_exited', function(key, location, distance) {
    console.log('key_exited', key, location, distance);
  });
}, 1000);

class Root extends Component {
  render() {
    const rootStyle = {
      height: '100%'
    }
    return (
      <div style={rootStyle} >
        <Provider store={store}>
          <ReduxRouter />
        </Provider>
      </div>
    )
  }
}

// DOMReady(function() {
//   ReactDOM.render(<Root />, document.getElementById('agreable-venues'))
// })
