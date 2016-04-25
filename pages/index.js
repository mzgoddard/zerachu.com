// let entries = require.context('.', true, /^\.\/[^/]*\/(index|meta)$/);
let entries = require.context('!!compile!.', true, /^\.\/[^/]*\/(index)$/);
let metas = require.context('.', true, /^\.\/[^/]*\/(meta)$/);

// entries('./lorem-ipsum/index')(entry => console.log(entry));

let hotListeners = [];

if (module.hot && typeof window === 'object') {
  const acceptingId = {};
  const hotContext = ((_entries) => {
    var hotContext = function(key) {
      return function(cb) {
        _entries(key)(function(moduleExports, moduleId) {
          if (!acceptingId[moduleId]) {
            acceptingId[moduleId] = 1;
            module.hot.accept(moduleId, function() {
              hotListeners.forEach(fn => fn());
            });
          }
          cb(moduleExports, moduleId);
        });
      };
    };
    hotContext.keys = function() {
      return _entries.keys();
    };
    hotContext.id = _entries.id;
    return hotContext;
  });
  hotListeners = window.__blogsListeners = window.__blogsListeners || [];
  module.hot.accept(entries.id, function() {
    entries = require.context('!!compile!.', true, /^\.\/[^/]*\/(index)$/);
    entries = hotContext(entries);
    hotListeners.forEach(fn => fn());
  });
  entries = hotContext(entries);
  module.hot.accept(metas.id, function() {
    metas = require.context('.', true, /^\.\/[^/]*\/(meta)$/);
    hotListeners.forEach(fn => fn());
  });
}

exports = module.exports = function(key) {
  return entries(key);
};

exports.keys = function() {
  return entries.keys();
};

exports.blogs = function(key) {
  return entries(`./${key}/index`);
};

exports.blogsKeys = function() {
  return entries.keys()
  .map(key => key.substring(2, key.lastIndexOf('/')))
  .filter((key, index, ary) => {
    return (
      !exports.metas(key).page &&
      ary.indexOf(key) === index
    );
  });
};

exports.metas = function(key) {
  try {
    const entry = metas(`./${key}/meta`);
    return entry.default || entry;
  }
  catch (error) {
    return {};
  }
};

exports.addListener = function(fn) {
  hotListeners.push(fn);
};

exports.removeListener = function(fn) {
  hotListeners.splice(hotListeners.indexOf(fn), 1);
};
