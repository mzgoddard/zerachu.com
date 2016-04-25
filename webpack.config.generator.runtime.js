var HtmlPlugin = require('html-webpack-plugin');

var buildOptions = require('./webpack.config.build.babel');
buildOptions.plugins = buildOptions.plugins.filter(function(plugin) {
  return !(plugin instanceof HtmlPlugin);
});

module.exports = buildOptions;
