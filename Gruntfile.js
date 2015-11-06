'use strict';

module.exports = function(grunt) {
  // loads grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    jshint: 'grunt-jsxhint',
    jscs: 'grunt-jscs'
  });

  var path = require('path');

  // times how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // defines the configuration for all the tasks
  grunt.initConfig({
    // loads project settings
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        interrupt: true
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['develop']
      },
      // separate lint files from other development files
      lint: {
        files: [
          '<%= jshint.gruntfile.src %>',
          '<%= jshint.scripts.src %>'
        ],
        tasks: ['newer:jscs', 'newer:jshint']
      }
    },
    jshint: {
      options: {
        maxerr: 10, // [TBD] For Shortening Run-Time Purpose
        reporter: require('jshint-html-reporter'),
        force: true,
        strict: true,
        devel: true,
        undef: true,
        bitwise: true,
        latedef: true,
        noarg: true,
        unused: true,
        globals: {
          modules: true,
          exports: true,
          console: true
        }
      },
      gruntfile: {
        src: [
          path.resolve(__dirname, '../Gruntfile.js')
        ],
        options: {
          reporterOutput: 'reporter/grunt.jshint.html',
          node: true
        }
      },
      scripts: {
        src: [
          path.resolve(__dirname, '../**/*.+(js|jsx)'),
          '!' + path.resolve(__dirname, '../Gruntfile.js'),
          '!' + path.resolve(__dirname, '../js-build-automating-system/**'),
          '!' + path.resolve(__dirname, '../**/*.min.+(js)'),
          '!' + path.resolve(__dirname, '../node_modules/**'),
          '!' + path.resolve(__dirname, '../**/bower_components/**')
        ],
        options: {
          reporterOutput: 'reporter/scripts.jshint.html',
          esnext: true,
          browser: true,
          browserify: true,
          globals: {
            node: true,
            modules: true,
            exports: true,
            console: true,
            angular: true,
            $: true,
            _: true,
            moment: true,
            numeral: true,
            runs: true,
            waitsFor: true
          }
        }
      }
    },
    jscs: {
      options: {
        maxErrors: 10, // [TBD] For Shortening Run-Time Purpose
        fix: false,
        verbose: true,
        force: true
      },
      gruntfile: {
        src: '<%= jshint.gruntfile.src %>',
        options: {
          preset: 'grunt',
          reporterOutput: 'reporter/grunt.jscs.txt'
        }
      },
      scripts: {
        src: '<%= jshint.scripts.src %>',
        options: {
          preset: 'google',
          reporterOutput: 'reporter/scripts.jscs.txt'
        }
      }
    },
    // empties folders to start fresh
    clean: {
      dev: 'reporter',
      lint: 'reporter'
    },
    /// [NOTE] JEST Not Working For Now Since `--harmony` Flag Is Not Able To Setup
    //jest: {
    //  coverage: true,
    //  testPathPattern: /.*.spec.js/
    //}

  });

  // for setup development environment
  grunt.registerTask('develop', ['clean:dev', 'jscs', 'jshint', 'watch:gruntfile']);

  // for setup linting environment
  grunt.registerTask('lint', ['clean:lint', 'jscs', 'jshint', 'watch:lint']);

  // for default task
  grunt.registerTask('default', 'lint');
};
