var HtmlPlugin = require('html-webpack-plugin');

var fileExtensions = ['ttf'];

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
  entry: './src/generator',
  output: {
    path: 'dist-tmp',
    filename: 'generator.js',
    chunkFilename: '[id].[id].js',
    libraryTarget: 'commonjs2',
  },
  recordsPath: __dirname + '/dist-tmp/records.json',
  target: 'node',
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
        test: /\.styl$/,
        loader: 'css-loader/locals!stylus-loader',
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
    .concat(fileExtensions.map(function(ext) {
      return {
        test: new RegExp('\\.' + ext + '$'),
        loader: 'file-loader',
      };
    })),
  },
  externals: ['webpack', __dirname + '/web_loaders/compile-loader/webpack.config'],
  resolve: {
    extensions: ['', '.js', '.jsx', '.md'],
    modulesDirectories: ['node_modules', 'web_loaders'],
  },
  resolveLoader: {
    modulesDirectories: ['node_modules', 'web_loaders'],
  },
  plugins: []
  // .concat(
  //   new HtmlPlugin({
  //     template: 'src/index.html',
  //     filename: 'index.html',
  //   })
  // ),
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
