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
        tasks: ['jscs', 'jshint']
      }
    },
    jshint: {
      options: {
        force: true,
        strict: true,
        devel: true,
        undef: true,
        bitwise: true,
        latedef: true,
        noarg: true,
        unused: true,
        reporter: require('jshint-stylish'),
        globals: {
          modules: true,
          exports: true,
          console: true
        }
      },
      gruntfile: {
        src: [process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, 'Gruntfile.js') || path.resolve(__dirname, 'my-project-dir/Gruntfile.js')],
        options: {
          reporterOutput: 'reporter/grunt.jshint.txt',
          node: true
        }
      },
      scripts: {
        src: [
          process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, '**/*.+(js|jsx)') || path.resolve(__dirname, 'my-project-dir'),
          '!' + (process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, '/node_modules/**') || path.resolve(__dirname, 'my-project-dir/node_modules/**')),
          '!' + (process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, '/client/bower_components/**') || path.resolve(__dirname, 'my-project-dir/client/bower_components/**'))
        ],
        options: {
          reporterOutput: 'reporter/scripts.jshint.txt',
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
        fix: false,
        verbose: true,
        force: true
      },
      gruntfile: {
        src: [process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, 'Gruntfile.js') || path.resolve(__dirname, 'my-project-dir/Gruntfile.js')],
        options: {
          preset: 'grunt',
          reporterOutput: 'reporter/grunt.jscs.txt'
        }
      },
      scripts: {
        src: [
          process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, '**/*.+(js|jsx)') || path.resolve(__dirname, 'my-project-dir'),
          '!' + (process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, '/node_modules/**') || path.resolve(__dirname, 'my-project-dir/node_modules/**')),
          '!' + (process.env.MY_ABS_PATH && path.resolve(process.env.MY_ABS_PATH, '/client/bower_components/**') || path.resolve(__dirname, 'my-project-dir/client/bower_components/**'))
        ],
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
