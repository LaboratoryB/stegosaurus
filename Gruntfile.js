module.exports = function (grunt) {

  // Load grunt tasks automatically
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.initConfig({
    nodeunit: {
      all: ['test/*.js'],
      options: {
        reporter: 'verbose'
      }
    }
  });

}