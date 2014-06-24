'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    _ = require('lodash');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./server/config');

// Bootstrap db connection
var mongoose = require('mongoose');
var db = mongoose.connect(config.db);

// Bootstrap models
var loadModels = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)Model\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory() && file !== 'config') {
            loadModels(newPath);
        }
    });
};
loadModels(__dirname);

// Bootstrap passport config
require('./server/passport')(passport);

// Create and configure the express app
var app = express();
require('./server/express')(app, passport, db);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

// Expose app
exports = module.exports = app;
