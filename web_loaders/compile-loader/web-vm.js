var manifestPromise;

function getFullManifest() {
  if (!manifestPromise) {
    manifestPromise = new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', '/compile-manifest.json');
      req.onload = function() {resolve(req);};
      req.onerror = reject;
      req.send();
    })
    .then(function(xhr) {return xhr.responseText;})
    .then(JSON.parse);
  }
  return manifestPromise;
}

// function getManifest() {
//   if (!manifestPromise) {
//
//   }
//   if (typeof compileLoaderManifest === 'object') {
//
//   }
// }

module.exports = function getInfo(path, fn) {
  if (typeof compileLoaderManifest === 'object') {
    if (compileLoaderManifest[path]) {
      fn(compileLoaderManifest[path]);
      return Promise.resolve(compileLoaderManifest[path]);
    }
  }
  return getFullManifest()
  .then(function(manifest) {
    return manifest[path];
  })
  .then(function(info) {fn && fn(info); return info;});
}
