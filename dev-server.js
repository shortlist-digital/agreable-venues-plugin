var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var configBuilder = require('./webpack.development.config');
var fs = require('fs')
var path = require('path')
var open = require('open')
 
const contentIndex = path.join(__dirname, 'static-dev-files')

function startServer(port, cb) {
  var config = configBuilder(port)
  new WebpackDevServer(webpack(config), {
    contentBase: contentIndex,
    publicPath: config.output.publicPath,
    stats: {colors: true},
    hot: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" }
  }).listen(port, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:' + port);
    cb()
  });
}

startServer(9090, function() {
  open('http://localhost:9090/map');
});
