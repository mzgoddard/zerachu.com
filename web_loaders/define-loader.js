var loaderUtils = require('loader-utils');

module.exports = function(content) {
  this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
  return Object.keys(query).map(function(key) {
    return 'var ' + key + ' = ' + JSON.stringify(query[key]) + ';';
  }).join('\n') + content;
};
