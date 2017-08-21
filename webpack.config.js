var webpack = require('webpack')
var nib = require('nib')
var path = require('path')
// var ExtractTextPlugin = require("extract-text-webpack-plugin")

var buildPath = path.resolve(__dirname, 'resources', 'assets');
var mainPath = path.resolve(__dirname, 'src', 'main.js');

module.exports = {
  target: 'web',
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'app.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      // { test: /\.styl$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader?paths[]=./styles&paths[]=./node_modules")},
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      },
      // { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.woff$|.eot$|.svg$|.ttf$|.png$|.gif$|.jpg$|.jpeg$/,
        loader: 'url-loader'
      },
      {
        test: /\.js?$/,
        // exclude: /node_modules/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules/svg-inline-react')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },

  plugins: [
    // new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      __PRODUCTION__: 'true'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  resolve: {
    // context: __dirname,
    extensions: ['.js', '.json']
    // modulesDirectories: [
    //   'widgets', 'javascripts', 'web_modules', 'style-atoms', 'node_modules'
    // ]
  }

  // stylus: {
  //   use: [nib()]
  // }
}
