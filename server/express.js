'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    logger = require('morgan'),
    dustjs = require('adaro'),
    assetmanager = require('assetmanager'),
    config = require('./config'),
    _ = require('lodash'),
    fs = require('fs'),
    index = require('./index/IndexController');


var loadAPIs = function(path, router) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile() && /(.*)API\.(js$|coffee$)/.test(file)) {
            require(newPath)(router);
        } else if (stat.isDirectory() && file !== 'config') {
            var subRouter = express.Router();
            loadAPIs(newPath, subRouter);
            router.use('/' + file, subRouter);
        }
    });
};


module.exports = function(app, db) {

    app.set('showStackError', true);

    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    if (process.env.NODE_ENV === 'development') {
        app.locals.pretty = true;  // Prettify HTML
        app.use(logger({format: 'dev', immediate: true}));
    }

    // assign the template engine to .dust files
    app.engine('dust', dustjs.dust());
    app.set('view engine', 'dust');
    app.set('views', config.root + '/server');

    // Should be placed before express.static
    app.use(compress());

    // Setting the fav icon and static folder
    app.use(favicon(config.root + '/client/img/icons/espresso.ico'));
    app.use(express.static(config.root + '/client'));

    app.use(function (req, res, next) {
        res.locals.assets = assetmanager.process({
            assets: require('../client/assets.json'),
            debug: (process.env.NODE_ENV !== 'production'),
            webroot: 'client'
        });
        next();
    });

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser());
    app.use(methodOverride());

    // Express/Mongo session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new mongoStore({
            //db: db.connection.db,
            mongoose_connection: db.connection,
            collection: config.sessionCollection
        })
    }));

    // Use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // Bootstrap Routes
    var router = express.Router();
    loadAPIs(__dirname, router);
    app.use('/api', router);

    // If we've come this far, no route matches, send the client.
    // The problem with this is that everything returns 200!
    app.use(function(req, res) {
        index.render(req, res);
    });

};
