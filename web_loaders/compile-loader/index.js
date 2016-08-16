var path = require('path');

var loaderUtils = require('loader-utils');

module.exports = function() {};

module.exports.pitch = function(remainingRequest) {
  this.cacheable();
  var vm = 'web-dev-vm';
  if (this.options.target === 'node') {
    vm = 'node-vm';
  }
  else if (process.env.NODE_ENV === 'production') {
    vm = 'web-vm';
  }
  var vmPath = loaderUtils.stringifyRequest(this, '!!' + __dirname + '/vm.js');
  var subvmPath = loaderUtils.stringifyRequest(this, '!!' + __dirname + '/' + vm + '.js');
  var remaining = JSON.stringify(path.relative(this.options.context, remainingRequest));
  return 'module.exports = require(' + vmPath + ')(' +
    'require(' + subvmPath + '), ' +
    remaining +
  ');';
};
