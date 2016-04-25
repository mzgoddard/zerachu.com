var DefinePlugin = require('webpack').DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
  entry: './src/index.prod',
  output: {
    path: 'dist',
    filename: '[hash].js',
    chunkFilename: '[id].[id].js',
    publicPath: '/',
  },
  recordsPath: __dirname + '/dist-tmp/records.json',
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
        loader: ExtractTextPlugin.extract(
          'style-loader', 'css-loader!stylus-loader'
        ),
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
  resolve: {
    extensions: ['', '.js', '.jsx', '.md'],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new ExtractTextPlugin('[contenthash].css'),
  ]
  .concat(
    new HtmlPlugin({
      template: 'src/index.html',
      filename: 'template.html',
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
