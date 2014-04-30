'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var WebappGenGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic WebappGen generator.'));

    var prompts = [{
      type: 'input',
      name: 'appTitle',
      message: 'What\'s the name of your new fancy app?',
      default: 'Webapp'
    },{
      type: 'checkbox',
      name: 'bowerPackages',
      message: 'Which bower packages do you want to install, sir?',
      choices: [
        {
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: true
        }, {
          name: 'jQuery',
          value: 'includeJQuery',
          checked: true
        }
      ]
    }];

    this.prompt(prompts, function (features) {
      function includedBowerFeature(f) {
        return bower.indexOf(f) !== -1;
      }


      var bower = features.bowerPackages

      this.appTitle = features.appTitle;

      this.bootstrap = includedBowerFeature("includeBootstrap");
      this.jQuery = includedBowerFeature("includeJQuery");

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('assets');
    this.mkdir('assets/images');
    this.mkdir('assets/stylesheets');
    this.mkdir('assets/stylesheets/scss');
    this.mkdir('assets/stylesheets/css');
    this.mkdir('assets/stylesheets/min/css');
    this.mkdir('assets/javascripts');
    this.mkdir('assets/javascripts/min');

    // tests
    this.mkdir('test');
    this.template('test/testSpec.js', 'test/testSpec.js');

    // html, css, js
    this.template('index.html', 'index.html');
    this.template('stylesheets/style.scss', 'assets/stylesheets/scss/style.scss');
    this.template('javascripts/script.js', 'assets/javascripts/script.js');

    // Gruntfile
    this.copy('Gruntfile.js', 'Gruntfile.js');

    // config
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.template('_config.json', 'config.json');
    this.template('_jshintrc', 'jshintrc');
  },

  projectfiles: function () {
    this.copy('config/gitignore', '.gitignore')
    this.copy('config/bowerrc', '.bowerrc');
    this.copy('config/editorconfig', '.editorconfig');
    this.copy('config/jshintrc', '.jshintrc');
  }
});

module.exports = WebappGenGenerator;