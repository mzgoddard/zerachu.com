module.exports = function(grunt) {
  var fs = require('fs');
  var path = require('path');

  var mkdirp = require('mkdirp');

  grunt.registerMultiTask('build-static', function() {
    var options = this.options();
    var routes = options.routes;

    var generator = require('../dist-tmp/generator');

    var done = this.async();

    var template = fs.readFileSync(
      __dirname + '/../dist/template.html',
      'utf8'
    );

    routes.reduce(function(carry, route) {
      var dir = path.resolve(__dirname, '../dist/' + route);
      return carry
      .then(function() {
        return new Promise(function(resolve) {
          mkdirp(dir, function() {resolve();});
        });
      })
      .then(function() {
        var output = fs.createWriteStream(path.resolve(dir, 'index.html'));
        return generator({
          template: template,
          route: route,
          write: output.end.bind(output),
          webpackOptionsNode: __dirname + '/../webpack.config.generator.node-runtime.js',
          webpackOptionsWeb: __dirname + '/../webpack.config.generator.runtime.js',
        });
      });
    }, Promise.resolve())
    .then(function() {done();}, done);
  });

  grunt.config.set('build-static', {
    target: {
      options: {
        routes: [
          '/',
          'blog',
          'blog/drafts',
          'games',
        ]
        .concat(fs.readdirSync('pages')
          .filter(function(name) {
            try {
              return (
                path.basename(name, '.js') === name &&
                fs.statSync(path.join('pages', name, 'page.js')) === null
              );
            }
            catch (error) {
              return path.basename(name, '.js') === name;
            }
          })
          .map(function(name) {
            return 'blog/entry/' + name;
          })
        ),
      },
    },
  });
};
