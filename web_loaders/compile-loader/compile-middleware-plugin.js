var path = require('path');

var express = require('express');

var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var CompileLoaderPlugin = require('./compile-entry-plugin');
var chunkModuleInfo = require('./util').chunkModuleInfo;

module.exports = CompileMiddlewarePlugin;

function CompileMiddlewarePlugin() {
  this.webpackDevCompiler = null;
  this.watchNextCompilation = [];
  this.whenNotCompiling = null;
  this.apply = this.apply.bind(this);
}

CompileMiddlewarePlugin.prototype.apply = function(compiler) {
  compiler.apply(new CompileLoaderPlugin());

  var _this = this;
  _this.webpackDevCompiler = compiler;
  compiler.plugin('emit', function(compilation, cb) {
    var _watchNextCompilation = _this.watchNextCompilation.slice();
    _this.watchNextCompilation.length = 0;
    _watchNextCompilation.forEach(function(fn) {
      fn(compilation);
    });
    cb();
  });
  var whenNotCompilingResolve = function() {};
  compiler.plugin('invalid', function() {
    _this.whenNotCompiling = new Promise(function(resolve) {
      whenNotCompilingResolve = resolve;
    });
  });
  compiler.plugin('done', function() {
    whenNotCompilingResolve();
  });
};

CompileMiddlewarePlugin.prototype.middleware = function() {
  var _this = this;
  var app = express();
  var entries = {};
  app.get('/compile*', function(req, res) {
    var entry = req.params[0];
    if (!entries[entry]) {
      entries[entry] = Promise.resolve(_this.whenNotCompiling)
      .then(function() {
        return new Promise(function(resolve) {
          var entryName = path.basename(path.dirname(entry));
          _this.watchNextCompilation.push(function(compilation) {
            // Pull out desired chunk info
            resolve(chunkModuleInfo(entryName, entry, compilation));
          });
          _this.webpackDevCompiler.apply(new SingleEntryPlugin(
            _this.webpackDevCompiler.options.context,
            '/compile-entry' + entry,
            entryName
          ));
          _this.webpackDevCompiler.watchFileSystem.watcher
          .emit('aggregated', []);
        })
        .catch(function(error) {
          console.error(error.stack || error);
          throw error;
        });
      });
    }

    entries[entry].then(res.json.bind(res));
  });
  return app;
};
