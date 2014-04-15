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
      default: 'New Awesome App'
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
        }, {
          name: 'Angular JS',
          value: 'includeAngular',
          checked: false
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
      this.angular = includedBowerFeature("includeAngular");

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');
    this.mkdir('app/assets');
    this.mkdir('app/assets/images');
    this.mkdir('app/assets/stylesheets');
    this.mkdir('app/assets/stylesheets/scss');
    this.mkdir('app/assets/stylesheets/css');
    this.mkdir('app/assets/javascripts');

    // tests
    this.mkdir('test');
    this.template('test/testSpec.js', 'test/testSpec.js');

    // html, css, js
    this.template('index.html', 'index.html');
    this.template('stylesheets/app.scss', 'app/assets/stylesheets/scss/app.scss');
    this.template('stylesheets/reset.css', 'app/assets/stylesheets/css/reset.css');
    this.template('javascripts/app.js', 'app/assets/javascripts/app.js');

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