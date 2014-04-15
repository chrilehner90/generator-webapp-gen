(function() {
  "use strict";

  var LIVERELOAD_PORT = 35729;
  var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  module.exports = function (grunt) {
  // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      watch: {
        options: {
          nospawn: true,
          livereload: LIVERELOAD_PORT
        },
        scripts: {
          files: ['app/assets/javascripts/**/*.js', 'test/*Spec.js'],
          tasks: ['test', 'uglify']
        },
        css: { // watch all .scss files and call the sass task to convert them to .css
          files: 'app/assets/stylesheets/*.scss',
          tasks: ['sass', 'uglify']
        },
        livereload: {
          files: [
            'index.html',
            'app/assets/stylesheets/*.css', // reload converted .css file
            'app/assets/javascripts/*.js'
          ]
        }
      },
      connect: {
        options: {
          port: 9000,
          hostname: 'localhost'
        },
        livereload: {
          options: {
            middleware: function (connect) {
              return [
                lrSnippet,
                mountFolder(connect, '.')
              ];
            }
          }
        }
      },
      open: {
        server: {
          path: 'http://localhost:<%= connect.options.port %>'
        }
      },
      sass: {
        dist: {
          options: {
            style: 'expanded'
          },
          files: {
            'app/assets/stylesheets/css/style.css': 'app/assets/stylesheets/scss/style.scss',
            'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.css': 'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss'
          }
        }
      },
      jasmine: {
        pivotal: {
          src: 'app/assets/javascripts/**/*.js',
          options: {
            specs: 'test/*Spec.js',
            helpers: 'test/*Helper.js'
          }
        }
      },
      jshint: {
        all: ['Gruntfile.js', 'app/assets/javascripts/**/*.js', 'test/**/*.js']
      },
      uglify: {
        options: {
          compress: {
            drop_console: true
          }
        },
        my_target: {
          files: {
            'app/assets/javascripts/min/app.min.js': ['app/assets/javascripts/**/*.js']
          }
        }
      },
      cssmin: {
        combine: {
          files: {
            'app/assets/stylesheets/css/min/app.min.css': ['app/assets/stylesheets/css/*.css']
          }
        }
      }
    });

    grunt.registerTask('server', ['sass', 'uglify', 'cssmin', 'connect:livereload', 'open', 'watch']);
    grunt.registerTask('test', ['jasmine', 'jshint']);
  };
})();