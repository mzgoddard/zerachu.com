var path = require('path');

exports.chunkModuleInfo = function(entryName, entry, compilation) {
  return compilation.chunks.reduce(function(carry, chunk) {
    if (chunk.name === entryName) {
      var dependencies = chunk.modules[0].blocks[0].dependencies;
      var module = dependencies.reduce(function(carry, dep) {
        if (
          Boolean(dep.module) &&
          path.relative(compilation.compiler.context, dep.request) === entry
        ) {
          return dep;
        }
        return carry;
      }, null).module;
      return [chunk.chunks[0].id, module.id];
    }
    return carry;
  }, null);
};
