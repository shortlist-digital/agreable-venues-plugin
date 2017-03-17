const webpack = require('webpack')
const path = require('path')
const StatsPlugin = require('stats-webpack-plugin')

module.exports = (env) => ({
  target: 'web',
  entry: path.resolve(__dirname, 'src', 'main.js'),
  output: {
    path: path.resolve(__dirname, 'resources', 'assets'),
    filename: 'app.js',
    libraryTarget: 'commonjs2'
  }.
  module: {
    rules: [{
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'node_modules/svg-inline-react')
      ],
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['stage-0']
        }
      }]
    }]
  },
  plugins: [
    // expose environment to user
    new webpack.DefinePlugin({
      __PRODUCTION__: 'true'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new StatsPlugin('../stats.json', {
      chunkModules: true
    }),
    // minify/optimize output bundle, screw_ie8 a bunch
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  ]
})