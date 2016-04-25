require('babel-register');

module.exports = function(grunt) {
  grunt.loadTasks('grunt');

  grunt.registerTask('build-env', function() {
    process.env.NODE_ENV = 'production';
  });

  grunt.registerTask('default', ['webpack-dev-server:dev']);
};
