# Shortlist Media - Wordpress Venues Plugin

## Development of React/Redux App

`npm start` will install dependencies and open a browser window ready to go.

Plugin for displaying venues on a map powered by a Parse database.

### Dependencies

Assumes presence of:

* Timber
* Advanced Custom Fields

### Built with

* [Herbert](http://getherbert.com/) to make WP plugins friendly.
* [Parse](http://parse.com) as our DB. 
* [LeafletJS](http://leafletjs.com) for maps.
* React for JS views.
* Redux for JS state.
* webpack for build


### Inline SVGs

Using [svg-inline-loader](https://github.com/sairion/svg-inline-loader) and [svg-inline-react](https://github.com/sairion/svg-inline-react).  

Implementation example:  

```
<InlineSVG src={require('!svg-inline!../../icons/facebook.svg')} />
```

The prefixed bang (`!`) is necessary. [Explained here](https://github.com/sairion/svg-inline-loader/issues/15).
