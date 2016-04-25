var buildOptions = require('./webpack.config.generator.babel');
buildOptions.output = {
  path: 'dist-tmp',
  filename: '[name].js',
  chunkFilename: '[id].[id].js',
  libraryTarget: 'commonjs2',
};

module.exports = buildOptions;
