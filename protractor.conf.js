/**
 * Created by mdeluco on 2014-07-03.
 */
'use strict';

exports.config = {

    baseUrl: 'http://localhost:3001',
    framework: 'mocha',

    specs: [
        'client/client/**/tests/e2e/*Test.js'
    ]

};