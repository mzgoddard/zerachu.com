var fileExtensions = exports.fileExtensions = ['ttf', 'woff'];
var urlExtensions = exports.urlExtensions = ['woff2'];

exports.loaders = fileExtensions
  .map(function(ext) {
    return {
      test: new RegExp('\\.' + ext + '$'),
      loader: 'file-loader',
    };
  })
  .concat(urlExtensions.map(function(ext) {
    return {
      test: new RegExp('\\.' + ext + '$'),
      loader: 'url-loader',
    };
  }));
