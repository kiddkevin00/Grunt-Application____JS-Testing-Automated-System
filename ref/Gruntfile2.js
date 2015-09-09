'use strict';

module.exports = function(grunt) {
  // loads grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    browserify: 'grunt-browserify',
    jshint: 'grunt-jsxhint',
    jscs: 'grunt-jscs'
  });

  // times how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // defines the configuration for all the tasks
  grunt.initConfig({
    // loads project settings
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev: {
        NODE_ENV: 'development',
        PORT_NUMBER: '8000', // `PORT` name not working
        IP_ADDRESS: '127.0.0.1'
      },
      test: {
        NODE_ENV: 'test',
        PORT_NUMBER: '8001', // `PORT` name not working
        IP_ADDRESS: '127.0.0.1'
      },
      prod: {
        NODE_ENV: 'production',
        PORT_NUMBER: '8888', // `PORT` name not working
        IP_ADDRESS: '127.0.0.1'
      }
    },
    browserify: {
      options: {
        transform: ['reactify']
      },
      client: {
        files: {
          'client/static/app/index-<%= pkg.version %>.js': [
            'client/src/app/app.jsx'
          ]
        },
        options: {
          watch: true
        }
      }
    },
    express: {
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'server/app.js',
          debug: false
        }
      }
    },
    watch: {
      options: {
        interrupt: true
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.+(js|json)'
        ],
        tasks: ['express:dev', 'wait-for-server'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      livereload: {
        files: [
          'client/static/app/index-0.0.0.js',
          'client/static/index2.html'
        ],
        options: {
          livereload: true
        }
      },
      template: {
        files: [
          'client/static/**/*.css'
        ],
        options: {
          livereload: true
        }
      },
      // separate test files from other development files
      test: {
        files: [
          '<%= jshint.gruntfile.src %>',
          '<%= jshint.client.files.common %>',
          '<%= jshint.client.files.dashboard %>',
          '<%= jshint.server.src %>'
        ],
        /// [TBD] For Faster Development Purpose
        //tasks: ['jscs', 'jshint']
      }
    },
    open: {
      dev: {
        url: 'http://localhost:8000'
      },
      test: {
        url: 'http://localhost:8001'
      },
      prod: {
        url: 'http://localhost:8888'
      }
    },
    jshint: {
      options: {
        reporterOutput: 'reporter/jshint.reporter.txt',
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
        src: ['Gruntfile.js'],
        options: {
          node: true
        }
      },
      client: {
        files: {
          common: [
            'client/src/common/**.js',
            '!client/src/common/**.spec.js'
          ],
          dashboard: ['client/src/app/dashboard/**.+(js|jsx)']
        },
        options: {
          esnext: true,
          browser: true,
          browserify: true,
          globals: {
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
      },
      server: {
        src: [
          'server/**.js',
          '!server/**.spec.js'
        ],
        options: {
          node: true
        }
      }
    },
    jscs: {
      options: {
        reporterOutput: 'reporter/jscs.reporter.txt',
        fix: false,
        verbose: true,
        force: true
      },
      gruntfile: {
        src: ['Gruntfile.js'],
        options: {preset: 'grunt'}
      },
      client: {
        files: {
          common: [
            'client/src/common/**.js',
            '!client/src/common/**.spec.js'
          ],
          dashboard: ['client/src/app/dashboard/**.+(js|jsx)']
        },
        options: {
          preset: 'google',
          esnext: true
        }
      },
      server: {
        src: [
          'server/**.js',
          '!server/**.spec.js'
        ],
        options: {preset: 'google'}
      }
    },
    // [NOTE] JEST Not Working For Now Since `--harmony` Flag Is Not Able To Setup
    jest: {
      coverage: true,
      testPathPattern: /.*.spec.js/
    },
    // empties folders to start fresh
    clean: {
      dev: 'client/static/app/**/*.js',
      test: ['reporter', 'coverage'],
      prod: 'dist'
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          unused: true,
          conditionals: true,
          booleans: true,
          if_return: true,
          join_vars: true
        }
      },
      dashboard: {
        src: [
          'client/static/app/dashboard/index-<%= pkg.version %>.js'
        ],
        dest: 'dist/app/dashboard/index-<%= pkg.version %>.js'
      }
      // [TODO] Minify (And Concat) All CSS And HTML Files As Well

    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9', 'ie 10']
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'client/static/',
          src: '**/*.css',
          dest: 'client/static/'
        }]
      }
    }

  });

  // for delaying livereload until after server has restarted
  grunt.registerTask('wait-for-server', function() {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function() {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  // for setup development environment
  grunt.registerTask('develop', ['clean:dev', 'env:dev', 'autoprefixer:dev', 'express:dev', 'browserify', 'wait-for-server', 'open:dev',
    'watch']);

  // for setup testing environment
  grunt.registerTask('lint', ['clean:test', 'env:test', 'jscs', 'jshint', 'watch:test']);

  // for setup production environment
  grunt.registerTask('build', ['clean:prod', 'env:prod', 'browserify', 'uglify', 'express:prod', 'wait-for-server',
    'open:prod', 'express-keepalive']);

  // for default task
  grunt.registerTask('default', 'develop');
};
