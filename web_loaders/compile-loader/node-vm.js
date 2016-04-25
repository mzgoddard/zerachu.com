var path = require('path');

var webpack = require('webpack');
// var webpackOptions = require('./webpack.config');
var Plugin = require('./compile-entry-plugin');
var chunkModuleInfo = require('./util').chunkModuleInfo;

var entries = {};

var options = [];

exports = module.exports = function getInfo(filepath, fn) {
  if (!entries[filepath]) {
    var fakeEntry = '/compile-entry' + filepath;
    var entryName = path.basename(path.dirname(filepath));
    entries[filepath] = new Promise(function(resolve, reject) {
      var webpackOptions = options[0];
      webpackOptions.entry = {};
      webpackOptions.entry[entryName] = fakeEntry;
      if (webpackOptions.plugins.reduce(function(carry, plugin) {
        return carry && !(plugin instanceof Plugin);
      }, true)) {
        webpackOptions.plugins = webpackOptions.plugins
        .concat(new Plugin());
      }
      var compiler = webpack(webpackOptions);
      var compilation;
      compiler.plugin('emit', function(_compilation, cb) {
        compilation = _compilation;
        cb();
      });
      compiler.run(function(error) {
        if (error) {return reject(error);}
        resolve();
      });
    })
    .then(function() {
      return new Promise(function(resolve, reject) {
        var webpackOptions = options[1];
        webpackOptions.entry = {};
        webpackOptions.entry[entryName] = fakeEntry;
        if (webpackOptions.plugins.reduce(function(carry, plugin) {
          return carry && !(plugin instanceof Plugin);
        }, true)) {
          webpackOptions.plugins = webpackOptions.plugins
          .concat(new Plugin());
        }
        var compiler = webpack(webpackOptions);
        var compilation;
        compiler.plugin('emit', function(_compilation, cb) {
          _compilation.chunks.forEach(function(chunk) {
            if (chunk.name === entryName) {
              chunk.files.forEach(function(filename) {
                delete _compilation.assets[filename];
              });
            }
          });
          // console.error(_compilation.assets);
          // console.error(_compilation.chunks[0]);
          compilation = _compilation;
          cb();
        });
        compiler.run(function(error) {
          if (error) {return reject(error);}
          resolve(chunkModuleInfo(entryName, filepath, compilation));
        });
      });
    })
    .then(function(info) {
      var webpackOptions = options[1];
      var manifestPath = path.join(webpackOptions.output.path, 'compile-manifest.json');
      var manifestData;
      try {
        manifestData = require('fs').readFileSync(manifestPath).toString();
      }
      catch (error) {
        manifestData = '{}';
      }
      var manifest = JSON.parse(manifestData);
      manifest[filepath] = info;
      require('fs').writeFileSync(manifestPath, JSON.stringify(manifest));
      return info;
    });
  }
  return entries[filepath]
  .then(function(info) {fn && fn(info); return info;});
};

exports.setWebpackOptions = function(nodeOptions, webOptions) {
  options.length = 0;
  options.push(nodeOptions, webOptions);
};
