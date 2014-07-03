'use strict';

var assetmanager = require('assetmanager')
    , assets = assetmanager.process({
        assets: require('./client/assets.json'),
        debug: true,
        webroot: 'client/'
    });


module.exports = function(config) {
    return {

        basePath: './client',
        frameworks: ['mocha', 'chai'],
        reporters: ['progress', 'coverage'],
        colors: true,  // reporters and logs
        autoWatch: true,
        singleRun: true,
        port: 9876,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR
        // || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

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

        // list of files / patterns to load in the browser
        files: [].concat.apply([], [
            assets.main.vendorJs,
            assets.main.clientJs,
            assets.test.testJs
        ])

//        // coverage
//        preprocessors: {
//            // source files, that you wanna generate coverage for
//            // do not include tests or libraries
//            // (these files will be instrumented by Istanbul)
//            'client/**/*Controller.js': ['coverage'],
//            'client/**/*Service.js': ['coverage'],
//            'client/**/*Module.js': ['coverage'],
//            'client/util/*.js': ['coverage']
//        },
//
//        coverageReporter: {
//            type: 'html',
//            dir: 'test/coverage/'
//        }

    };
};