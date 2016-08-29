var DefinePlugin = require('webpack').DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

var fileExtensions = ['ttf', 'woff'];

// var routes = [
//   '/',
//   '/blog/',
// ].concat(
//   require('fs').readdirSync(__dirname + '/blogs')
//   .filter(function(entry) {return !/\.js$/.test(entry);})
//   .map(function(entry) {return '/blog/entry/' + entry;})
// );

var normalStyleExtract = new ExtractTextPlugin('[contenthash].css');
var importantStyleExtract = new ExtractTextPlugin('important.css');

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
        // exclude: /src[\/\\]index\.styl$/,
        loader: normalStyleExtract.extract(
          'style-loader', 'css-loader!stylus-loader'
        ),
      },
      {
        test: /\.css$/,
        // exclude: /src[\/\\]index\.styl$/,
        loader: normalStyleExtract.extract(
          'style-loader', 'css-loader'
        ),
      },
      // {
      //   test: /src[\/\\]index\.styl$/,
      //   loader: importantStyleExtract.extract(
      //     'style-loader', 'css-loader!stylus-loader'
      //   ),
      // },
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
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    normalStyleExtract,
    // importantStyleExtract,
  ]
  .concat(
    {
      apply: function(compiler) {
        var importantStyleSource;
        compiler.plugin('emit', function(compilation, cb) {
          // console.log(compilation.assets);
          importantStyleSource = compilation.assets['important.css'];
          delete compilation.assets['important.css'];
          compilation.chunks.forEach(function(chunk) {
            var index = chunk.files.indexOf('important.css');
            if (index !== -1) {
              chunk.files.splice(index, 1);
            }
          });
          cb();
        });
        compiler.plugin('compilation', function(compilation) {
          // var importantAsset;
          compilation.plugin('html-webpack-plugin-after-html-processing', function(args, cb) {
            console.log('html-webpack-plugin-after-html-processing', args);
            // var importantCss = compilation.modules.reduce(function(carry, module) {
            //   return /src[\/\\]index\.styl$/.test(module.request) ? module : carry;
            // }, null);
            // if (importantCss) {
            //   importantCss.source(dependencyTemplates, outputOptions, requestShortener).source();
            // }
            if (importantStyleSource) {
              args.html = args.html.replace('<link', '<style>' + importantStyleSource.source() + '</style><link');
            }
            cb(null, args);
          });
        });
      },
    },
    new HtmlPlugin({
      template: 'src/index.html',
      filename: 'template.html',
    }),
    new UglifyJsPlugin()
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
