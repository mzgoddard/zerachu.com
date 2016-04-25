var path = require('path');

var RawModule = require('webpack/lib/RawModule');
var NormalModule = require('webpack/lib/NormalModule');

module.exports = CompileEntryPlugin;

function CompileEntryPlugin() {
  
}

CompileEntryPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation, params) {
    params.normalModuleFactory.plugin('resolver', function(resolver) {
      return function(data, callback) {
        if (/^\/compile-entry/.test(data.request)) {
          // console.log(data.request);
          // console.log(/^\/compile-entry(.*)/.exec(data.request)[1]);
          var entryFilepath = path.join(compiler.context, /^\/compile-entry(.*)/.exec(data.request)[1]);
          var entryModule = new NormalModule(entryFilepath, entryFilepath, entryFilepath, [], entryFilepath, params.normalModuleFactory.parser);
          entryModule.build = function(options, compilation, resolver, fs, callback) {
            // console.log('build ', data.request);
            NormalModule.prototype.build.call(this, options, compilation, resolver, {
              readFile: function(filepath, callback) {
                // console.log('readFile', filepath);
                callback(null, new Buffer('require.ensure([], function() {require(' + JSON.stringify(entryFilepath) + ')});'));
              },
            }, callback);
          };
          callback(null, entryModule);
          // callback(null, new RawModule(
          //   'require.ensure([], function() {require(' + JSON.stringify(/^\/compile-entry(.*)/.exec(data.request)[1]) + ')});',
          //   data.request,
          //   data.request
          // ));
        }
        else {
          resolver.apply(null, arguments);
        }
      };
    });
  });
};
