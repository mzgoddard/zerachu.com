require('babel-register');

module.exports = function(grunt) {
  grunt.loadTasks('grunt');

  grunt.registerTask('build-env', function() {
    process.env.NODE_ENV = 'production';
  });

  grunt.registerTask('default', ['webpack-dev-server:dev']);
  grunt.registerTask('build', ['build-env', 'webpack', 'build-static']);
  grunt.registerTask('deploy', ['clean', 'build', 'copy', 'shell']);
};
