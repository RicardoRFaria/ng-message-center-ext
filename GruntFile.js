module.exports = function (grunt) {

    grunt.initConfig({

        concat: {
            js: {
                options: {
                    separator: '\n'
                },
                dist: {
                    src: ['src/**/*.js'],
                    dest: 'dist/ng-message-center.js'
                }
            },
            css: {
                options: {
                    separator: ''
                },
                dist: {
                    src: ['src/**/*.css'],
                    dest: 'dist/ng-message-center.css'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/ng-message-center.min.js': ['src/**/*.js']
                }
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/ng-message-center.min.css': ['src/**/*.css']
                }
            }
        },

        jshint: {
            all: ['src/js/**.js'],

            options: {
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'report/jshint/index.html',
                force: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                maxcomplexity: true,
                unused: true,
                globals: {
                    jQuery: true
                }
            }
        },

        coveralls: {
            options: {
                debug: true,
                coverageDir: 'report/',
                force: true
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        clean: ["report", "dist"]

    });


    grunt.registerTask('test', ['clean', 'jshint']);
    grunt.registerTask('default', ['clean', 'karma', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('continuous', ['clean', 'karma:continuous', 'concat', 'uglify', 'cssmin', 'coveralls']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

};


