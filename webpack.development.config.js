var webpack = require('webpack')
var nib = require('nib')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var buildPath = path.resolve(__dirname, 'resources', 'assets');
var mainPath = path.resolve(__dirname, 'src', 'main.js');

module.exports = function(port) {
  return {
    entry: [
      'webpack-dev-server/client?http://localhost:' + port,
      'webpack/hot/only-dev-server',
      mainPath
    ],
    output: {
      path: path.join(__dirname, 'dist/'),
      filename: 'app.js',
      publicPath: 'http://localhost:' + port +'/static/'
    },
    module: {
      preLoaders: [{
        test:    /\.js$/,
        exclude: /node_modules/,
        loader: 'jscs-loader'
      }],
      loaders: [
        { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader?paths[]=./src/styles&paths[]=./node_modules'},
        { test: /\.svg$/, exclude:'node_modules', loader: 'raw-loader' },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.woff$|.eot$|.svg$|.ttf$|.png$|.gif$|.jpg$|.jpeg$/, loader: "url" },
        { test: /src\/.*\.jsx?$/, loaders: ['react-hot', 'babel-loader?stage=0&loose=all'], exclude: '/node_modules/',  include: path.join(__dirname, "src") }
      ]
    },

    plugins: [
      new ExtractTextPlugin('styles.css'),
      new webpack.HotModuleReplacementPlugin()
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

}

