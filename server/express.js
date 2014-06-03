'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    logger = require('morgan'),
    dustjs = require('adaro'),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config'),
    _ = require('lodash'),
    fs = require('fs');


var loadRoutes = function(path, router) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile() && /(.*)API\.(js$|coffee$)/.test(file)) {
            require(newPath)(router);
        } else if (stat.isDirectory() && file !== 'config') {
            var subRouter = express.Router();
            loadRoutes(newPath, subRouter);
            router.use('/' + file, subRouter);
        }
    });
};

module.exports = function(app, passport, db) {

    app.set('showStackError', true);

    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    // Should be placed before express.static
    app.use(compress());

    if (process.env.NODE_ENV === 'development') {
        app.locals.pretty = true;  // Prettify HTML
        app.use(logger({format: 'dev', immediate: true}));
    }

    /*
    // assign the template engine to .dust files
    app.engine('dust', dustjs.dust());
    // set .dust as the default extension
    app.set('view engine', 'dust');
    // Set views path, template engine and default layout
    app.set('views', config.root + '/client');
    */

    // Setting the fav icon and static folder
    app.use(favicon(config.root + '/client/img/icons/espresso.ico'));
    app.use(express.static(config.root + '/client'));

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser());
    app.use(methodOverride());

    // Express/Mongo session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        })
    }));


    // Dynamic helpers
    app.use(helpers(config.app.name));

    // Use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // Connect flash for flash messages
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.flash = req.flash();
        next();
    });

    // Bootstrap Routes
    var router = express.Router();
    loadRoutes(__dirname, router);
    app.use('/api', router);

    // If we've come this far, no route matches, send the client.
    // The problem with this is that everything returns 200!
    app.use(function(req, res) {
        res.sendfile(config.root + '/client/client/index/views/index.html');
    });

    // Assume "not found" in the error msgs is a 404. this is somewhat
    // silly, but valid, you can do whatever you like, set properties,
    // use instanceof etc.
    /*
    app.use(function(err, req, res, next) {
        // Treat as 404
        if (~err.message.indexOf('not found')) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
    */
};
