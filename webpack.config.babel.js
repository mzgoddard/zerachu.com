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
    path: 'dist-dev',
    filename: '[name].js',
  },
  // devtool: 'source-map',
  // recordsPath: __dirname + '/dist-module-cache/records.json',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        loader: 'baggage-loader?[file].styl=style&[file].css=style',
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
    {
      apply: function(compiler) {
        var start;
        compiler.plugin(['watch-run', 'run'], function(compiler, cb) {
          start = Date.now();
          cb();
        });
        compiler.plugin('compilation', function(compilation, params) {
          var _create = params.contextModuleFactory.create;
          params.contextModuleFactory.create = function(context, dependency, callback) {
            _create.call(params.contextModuleFactory, context, dependency, function(err, module) {
              if (err) {return callback(err);}
              var build = module.build;
              module.build = function() {
                var start = Date.now();
                var callback = arguments[arguments.length - 1];
                var args = [].slice.call(arguments, 0, arguments.length - 1);
                args.push(function() {
                  console.log(module.context, Date.now() - start);
                  callback.apply(null, arguments);
                });
                build.apply(module, args);
              };
              callback(null, module);
            });
          };
        });
        compiler.plugin('make', function(compilation, cb) {
          console.log('pre-make', Date.now() - start);
          start = Date.now();
          compilation.plugin('seal', function() {
            console.log('make', Date.now() - start);
            start = Date.now();
          });
          compilation.plugin('optimize-tree', function(chunks, modules, cb) {
            console.log('pre optimize-tree', Date.now() - start);
            start = Date.now();
            cb();
          });
          compilation.plugin('after-optimize-tree', function() {
            console.log('optimize-tree', Date.now() - start);
            start = Date.now();
          });
          compilation.plugin('after-optimize-assets', function() {
            console.log('post optimize-tree', Date.now() - start);
            start = Date.now();
          });
          cb();
        });
        compiler.plugin('emit', function(compilation, cb) {
          console.log('after-compile', Date.now() - start);
          start = Date.now();
          cb();
        })
        compiler.plugin('done', function() {
          console.log('emit', Date.now() - start);
        });
      },
    },
    new (require('hard-source-webpack-plugin'))({
      cacheDirectory: __dirname + '/dist-module-cache/[confighash]',
      recordsPath: __dirname + '/dist-module-cache/[confighash]/records.json',
      configHash: function(webpackConfig) {
        var hash = require('crypto').createHash('sha1');
        if (typeof webpackConfig.entry === 'string') {
          hash.update(webpackConfig.entry);
        }
        else if (Array.isArray(webpackConfig.entry)) {
          webpackConfig.entry.forEach(function(part) {
            hash.update(part);
          });
        }
        else if (typeof webpackConfig.entry === 'object') {
          Object.keys(webpackConfig.entry).forEach(function(key) {
            hash.update(key);
            webpackConfig.entry[key].forEach(function(part) {
              hash.update(part);
            });
          });
        }
        hash.update(webpackConfig.devtool || 'no-devtool');
        webpackConfig.module.loaders.forEach(function(loader) {
          hash.update(loader.loader || loader.loaders.join('!'));
        });
        webpackConfig.plugins.forEach(function(plugin) {
          hash.update(hash.contructor && hash.constructor.name || 'plugin');
        });
        return hash.digest().hexSlice();
      },
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
