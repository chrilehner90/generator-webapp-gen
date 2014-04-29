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
          tasks: ['sass', 'cssmin']
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
      concat: {
        options: {
          separator: ";"
        },
        dist: {
          src: [
                'app/assets/javascripts/**/*.js'
              ],
          dest: 'app/assets/javascripts/main.js'
        }
      },
      uglify: {
        options: {
          compress: {
            drop_console: true
          }
        },
        my_target: {
          files: {
            'app/assets/javascripts/min/main.min.js': ['app/assets/javascripts/main.js']
          }
        }
      },
      cssmin: {
        combine: {
          files: {
            'app/assets/stylesheets/css/min/main.min.css': [ 
              'bower_components/normalize.css/normalize.css',
              'bower_components/bootstrap/dist/css/bootstrap.min.css',
              'app/assets/stylesheets/css/*.css'
            ]
          }
        }
      }
    });

    grunt.registerTask('test', ['jasmine', 'jshint']);
    grunt.registerTask('serve', ['test', 'sass', 'concat', 'uglify', 'cssmin', 'connect:livereload', 'open', 'watch']);
    grunt.registerTask('s', ['serve']);
    
  };
})();