var path = require('path');

var loaderUtils = require('loader-utils');

module.exports = function() {};

module.exports.pitch = function(remainingRequest) {
  var vm = 'web-dev-vm';
  if (this.options.target === 'node') {
    vm = 'node-vm';
  }
  else if (process.env.NODE_ENV === 'production') {
    vm = 'web-vm';
  }
  return 'module.exports = require(' + loaderUtils.stringifyRequest(this, '!!' + __dirname + '/vm.js') + ')(require(' + loaderUtils.stringifyRequest(this, '!!' + __dirname + '/' + vm + '.js') + '), ' + JSON.stringify(path.relative(this.options.context, remainingRequest)) + ');';
};
