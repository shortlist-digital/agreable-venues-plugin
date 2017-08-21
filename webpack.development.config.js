var webpack = require('webpack')
var nib = require('nib')
var path = require('path')

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
      loaders: [
        { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader?paths[]=./src/styles&paths[]=./node_modules'},
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.woff$|.eot$|.svg$|.ttf$|.png$|.gif$|.jpg$|.jpeg$/, loader: "url" },
        { test: /\.jsx?$/, loaders: ['react-hot-loader', 'babel-loader'], exclude: '/node_modules/', include: [path.join(__dirname, "src"), path.join(__dirname, 'node_modules/svg-inline-react')] }
      ]
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __PRODUCTION__: 'false'
      })
    ],

    resolve: {
      extensions: ['.js', '.json', '.styl']
    }
  }

}

