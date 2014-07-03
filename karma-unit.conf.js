/**
 * Created by mdeluco on 2014-07-01.
 */
'use strict';

var karmaConfig = require('./karma.conf');

module.exports = function (config) {

    var conf = karmaConfig(config);

//    conf.files = conf.files.concat([
//        // mocks,
//        '/client/**/tests/unit/*Test.js'
//    ]);

    console.log(conf.files);

    config.set(conf);

};