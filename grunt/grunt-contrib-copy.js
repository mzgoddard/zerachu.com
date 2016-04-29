module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.config.set('copy', {
    deploy: {
      files: [{src: 'CNAME', dest: 'dist', expand: true}],
    },
  });
};
