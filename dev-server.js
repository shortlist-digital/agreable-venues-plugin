var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var configBuilder = require('./webpack.development.config');
var getPort = require('get-port');
var fs = require('fs');

getPort(function (err, port) {
  writePortNumberToFile(port)
  startServer(port);
});

function writePortNumberToFile(port) {
  fs.writeFile('webpack-current-port.tmp', port);
}

function startServer(port) {
  var config = configBuilder(port)
  new WebpackDevServer(webpack(config), {
    contentBase: 'http://localhost:' + port,
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
  });
}
