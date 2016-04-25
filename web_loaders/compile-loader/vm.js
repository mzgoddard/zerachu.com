(function() {
  require([], function() {require('./dummy');});
});

module.exports = function(getInfo, path) {
  var load = function(fn) {
    getInfo(path, function(response) {
      // console.log('compile-loader vm response', response);
      if (Array.isArray(response)) {
        __webpack_require__.e(response[0], function() {
          fn(__webpack_require__(response[1]), response[1]);
        });
      }
    })
    .catch(function(error) {console.error(error.stack || error);});
  };

  load.info = function(fn) {
    getInfo(path, fn)
    .catch(function(error) {console.error(error.stack || error);});
  };

  load.scripts = function(fn) {
    getInfo(path)
    .then(function(values) {
      var pathStr = JSON.stringify(path);
      var valuesStr = JSON.stringify(values);
      var chunk = values[0];
      return [
        {content: [
          '(function() {',
          '  if (typeof compileLoaderManifest === "function") {',
          '    var obj = {};',
          '    obj[' + pathStr + '] = ' + valuesStr + ';',
          '    compileLoaderManifest(obj);',
          '  }',
          '  else if (typeof compileLoaderManifest === "object") {',
          '    compileLoaderManifest[' + pathStr + '] = ' + valuesStr + ';',
          '  }',
          '  else {',
          '    var obj = {};',
          '    obj[' + pathStr + '] = ' + valuesStr + ';',
          '    compileLoaderManifest = obj;',
          '  }',
          '})();',
        ].join('\n')},
        {src: '/' + chunk + '.' + chunk + '.js'},
      ];
    })
    .then(fn)
    .catch(function(error) {console.error(error.stack || error);});
  };

  return load;
};
