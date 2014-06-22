'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    less: {
      development : {
        files : {
            "style/app.css" : "style/app.less"
        }
      }
    },
    uglify : {
        development : {
            files : {
                'js/production.js' : [
                    'js/jquery.min.js',
                    'js/bootstrap.min.js',
                    'js/app.js',
                    'js/moment.min.js'
                ]
            }
        }
    },
    watch: {
      style : {
        files: ['style/app.less', 'js/**/*.js'],
        tasks: ['less', 'uglify']
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['watch']);

};
