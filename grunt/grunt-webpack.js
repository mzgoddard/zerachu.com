module.exports = function(grunt) {
  var path = require('path');
  var webpack = require('webpack');
  var CompileMiddlewarePlugin = require('../web_loaders/compile-loader/compile-middleware-plugin');

  grunt.loadNpmTasks('grunt-webpack');

  grunt.config.set('webpack', {
    build: require('../webpack.config.build.babel'),
    generator: require('../webpack.config.generator.babel'),
  });

  var webpackDevOptions = require('../webpack.config.babel');

  var compileMiddlewarePlugin = new CompileMiddlewarePlugin();

  webpackDevOptions.plugins = webpackDevOptions.plugins
  .concat(compileMiddlewarePlugin);

  grunt.config.set('webpack-dev-server', {
    dev: {
      hot: true,
      inline: true,
      keepalive: true,
      host: '0.0.0.0',
      port: 8081,
      webpack: webpackDevOptions,
      setup: function(app) {
        app.use(compileMiddlewarePlugin.middleware());
      },
    },
  });
};
