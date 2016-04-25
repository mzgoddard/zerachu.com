function xhr(path) {
  var req = new XMLHttpRequest();
  req.open('GET', '/compile' + path);
  return new Promise(function(resolve, reject) {
    req.onload = function() {resolve(req);};
    req.onerror = reject;
    req.send();
  });
}

var compileLoaderManifest = {};
var entries = {};

module.exports = function getInfo(path, fn) {
  if (compileLoaderManifest[path]) {
    fn(compileLoaderManifest[path]);
    return Promise.resolve(compileLoaderManifest[path]);
  }
  if (!entries[path]) {
    entries[path] = xhr(path)
    .then(function(xhr) {return xhr.responseText;})
    .then(JSON.parse)
    .then(function(info) {compileLoaderManifest[path] = info; return info;});
  }
  return entries[path]
  .then(function(info) {fn && fn(info); return info;});
}
