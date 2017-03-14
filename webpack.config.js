var webpack = require('webpack')
var nib = require('nib')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var buildPath = path.resolve(__dirname, 'resources', 'assets');
var mainPath = path.resolve(__dirname, 'src', 'main.js');

module.exports = {
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.styl$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader?paths[]=./styles&paths[]=./node_modules")},
      { test: /\.svg$/, exclude:'/node_modules/', loader: 'raw-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.woff$|.eot$|.svg$|.ttf$|.png$|.gif$|.jpg$|.jpeg$/, loader: "url" },
      { test: /\.jsx?$/, exclude: '/node_modules/' , loader: 'babel-loader?stage=0', include: [path.join(__dirname, "src"), path.join(__dirname, 'node_modules/svg-inline-react')] }
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      __PRODUCTION__: 'true'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  resolve: {
    context: __dirname,
    extensions: ['','.js', '.json', '.styl'],
    modulesDirectories: [
      'widgets', 'javascripts', 'web_modules', 'style-atoms', 'node_modules'
    ]
  },

  stylus: {
    use: [nib()]
  }
}
