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
    router.get('/auth/facebook', passport.authenticate('facebook', {
        failureFlash: true,
        scope: ['email', 'user_about_me']
    }), UserCtrl.signin);

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureFlash: true
    }), UserCtrl.authCallback);

    // Setting the github oauth routes
    router.get('/auth/github', passport.authenticate('github', {
        failureFlash: true
    }), UserCtrl.signin);

    router.get('/auth/github/callback', passport.authenticate('github', {
        failureFlash: true
    }), UserCtrl.authCallback);

    // Setting the twitter oauth routes
    router.get('/auth/twitter', passport.authenticate('twitter', {
        failureFlash: true
    }), UserCtrl.signin);

    router.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureFlash: true
    }), UserCtrl.authCallback);

    // Setting the google oauth routes
    router.get('/auth/google', passport.authenticate('google', {
        failureFlash: true,
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), UserCtrl.signin);

    router.get('/auth/google/callback', passport.authenticate('google', {
        failureFlash: true
    }), UserCtrl.authCallback);

    // Setting the linkedin oauth routes
    router.get('/auth/linkedin', passport.authenticate('linkedin', {
        failureFlash: true,
        scope: [ 'r_emailaddress' ]
    }), UserCtrl.signin);

    router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        failureFlash: true
    }), UserCtrl.authCallback);

};
