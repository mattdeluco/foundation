'use strict';

// Karma configuration
// Generated on Sat Oct 05 2013 22:00:14 GMT+0700 (ICT)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './public',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'lib/angular/angular.js',
            'lib/angular-resource/angular-resource.js',
            'lib/angular-cookies/angular-cookies.js',
            'lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'lib/angular-ui-router/release/angular-ui-router.js',
            'lib/angular-mocks/angular-mocks.js',
            'client/app.js',
            'client/config.js',
            'client/directives.js',
            'client/filters.js',
            'client/GlobalService.js',
            'client/index/*.js',
            'client/users/*.js',
            //'client/articles/*.js',
            'client/init.js',
            'client/**/tests/*Test.js'
        ],


        // list of files to exclude
        exclude: [
            'client/articles/tests/*Test.js'
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        //reporters: ['progress'],
        reporters: ['progress', 'coverage'],

        // coverage
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'public/**/*Controller.js': ['coverage'],
            'public/**/*Service.js': ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir: 'test/coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};