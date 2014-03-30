'use strict';

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
      css: { // watch all .scss files and call the sass task to convert them to .css
        files: 'app/assets/stylesheets/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: [
          'index.html',
          'app/assets/stylesheets/*.css', // reload converted .css file
          'app/assets/javascripts/app.js'
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
        path: 'http://localhost:<%%= connect.options.port %>',
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/assets/stylesheets/app.css': 'app/assets/stylesheets/app.scss',
          'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.css': 'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss'
        }
      }
    }
  });

  grunt.registerTask('server', ['sass', 'connect:livereload', 'open', 'watch']);
};