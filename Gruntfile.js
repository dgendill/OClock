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
        exclude : ['js/production.js'],
        tasks: ['less', 'uglify', 'manifest']
      }
    },
      manifest : {
        generate : {
            options : {
                basePath : './',
                network : ['*'],
                timestamp : true,
                hash : true,
                master : 'index.html'
            },
            src : [
                'fonts/*.*',
                'js/**/*.js',
                'sounds/*.*',
                'style/app.css',
                'http://themes.googleusercontent.com/static/fonts/blackopsone/v5/2XW-DmDsGbDLE372KrMW1fn8qdNnd5eCmWXua5W-n7c.woff',
                'http://fonts.googleapis.com/css?family=Black+Ops+One'
            ],
            dest : 'oclock.appcache'
        }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-manifest');

  // Default task.
  grunt.registerTask('default', ['watch']);

};
