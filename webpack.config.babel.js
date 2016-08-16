var HtmlPlugin = require('html-webpack-plugin');

var fileExtensions = ['ttf', 'woff'];

// var routes = [
//   '/',
//   '/blog/',
// ].concat(
//   require('fs').readdirSync(__dirname + '/blogs')
//   .filter(function(entry) {return !/\.js$/.test(entry);})
//   .map(function(entry) {return '/blog/entry/' + entry;})
// );

module.exports = {
  context: __dirname,
  entry: './src',
  output: {
    filename: '[name].js',
  },
  // devtool: 'source-map',
  recordsPath: __dirname + '/dist-module-cache/records.json',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        loader: 'baggage-loader?[file].styl=style',
      },
      {
        test: /\.(styl|css)$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.styl$/,
        loader: 'stylus-loader',
      },
      {
        test: /\.(html|md)$/,
        loader: 'html-loader',
      },
      {
        test: /\.md$/,
        loader: 'remarkable-loader',
      },
    ]
    .concat(require('./webpack.extensions').loaders),
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.md'],
  },
  plugins: []
  .concat(
    new HtmlPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      chunks: ['main'],
    })
  )
  .concat(
    new (require('hard-source-webpack-plugin'))({
      cacheDirectory: 'dist-module-cache',
    })
  ),
  // .concat(routes.map(function(route) {
  //   console.log(route);
  //   console.log(encodeURIComponent(route));
  //   return new HtmlPlugin({
  //     template: 'define-loader?location=' +
  //       encodeURIComponent(route) +
  //       '!./src/index.bake.html',
  //     filename: (route.substring(1) || 'index') + '.html',
  //   });
  // })),
};
