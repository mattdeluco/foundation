'use strict';

// User routes use users controller
var passport = require('passport')
    , UserCtrl = require('./UserController')
    , accessLevels = require('../../client/client/auth/AuthAccessLevels').accessLevels
    , isAuthorized = require('../auth/AuthMiddleware').isAuthorized;

module.exports = function(router) {

    router.get('/user', isAuthorized(accessLevels.user), UserCtrl.me);
    router.put('/user', isAuthorized(accessLevels.user), UserCtrl.update);

    // Setting the facebook oauth routes
    router.get('/facebook', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '#!/signin',
        scope: ['public_profile', 'email']
    }));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '#!/signin'
    }));

    // Setting the twitter oauth routes
    router.get('/twitter', passport.authenticate('twitter', {
        failureRedirect: '#!/signin'
    }), UserCtrl.signin);

    router.get('/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '#!/signin'
    }), UserCtrl.authCallback);

    // Setting the google oauth routes
    router.get('/google', passport.authenticate('google', {
        failureRedirect: '#!/signin'
    }), UserCtrl.signin);

    router.get('/google/callback', passport.authenticate('google', {
        failureRedirect: '#!/signin'
    }), UserCtrl.authCallback);

    // Setting the linkedin oauth routes
    router.get('/linkedin', passport.authenticate('linkedin', {
        failureRedirect: '#!/signin'
    }), UserCtrl.signin);

    router.get('/linkedin/callback', passport.authenticate('linkedin', {
        failureRedirect: '#!/signin'
    }), UserCtrl.authCallback);

    // Setting the github oauth routes
    router.get('/github', passport.authenticate('github', {
        failureRedirect: '#!/signin'
    }), UserCtrl.signin);

    router.get('/github/callback', passport.authenticate('github', {
        failureRedirect: '#!/signin'
    }), UserCtrl.authCallback);

};
