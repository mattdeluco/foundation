'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('client/assets.json'),
        concat: {
            options: {
                separator: ';'
            },
            production: {
                files: [
                    '<%= assets.main.vendorCss %>',
                    '<%= assets.main.vendorJs %>'
                ]
            }
        },
        cssmin: {
            options: {},
            production: {
                files: ['<%= assets.main.clientCss %>']
            }
        },
        uglify: {
            options: {},
            production: {
                files: ['<%= assets.main.clientJs %>']
            }
        },
        watch: {
            dust: {
                files: ['server/**/*.dust'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: [
                    'gruntfile.js', 'server.js', 'server/**/*.js',
                    'client/**/*.js', 'test/**/*.js', 'client/assets.json'
                ],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['client/**/views/*.html'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['client/**/styles/*.css'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'server.js', 'server/**/*.js', 'client/**/*.js', 'test/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['client/**'],
                    watchedExtensions: ['js'],
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['server/**/tests/*Test.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint', 'concurrent']);

    //Test all task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

    // Test app task
    grunt.registerTask('test app', ['env:test', 'mochaTest']);

    grunt.registerTask('production', [
        'concat:production',
        'cssmin:production',
        'uglify:production'
    ]);
};
