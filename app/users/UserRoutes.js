'use strict';

// User routes use users controller
var user = require('./UserController');

module.exports = function(app, passport) {

    app.post('/user', function(req, res, next) {
        user.create(req, res, next, passport);
    });

    app.get('/user', user.me);
    app.put('/user', user.update);

    // Local authentication
    app.post('/signin', passport.authenticate('local-signin', {
        //failureRedirect: '/signin',
        failureFlash: true
    }), user.session);

    app.get('/signout', user.signout);

    // Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        //failureRedirect: '/signin',
        scope: ['email', 'user_about_me']
    }), user.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        //failureRedirect: '/signin'
    }), user.authCallback);

    // Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        //failureRedirect: '/signin'
    }), user.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        //failureRedirect: '/signin'
    }), user.authCallback);

    // Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        //failureRedirect: '/signin'
    }), user.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        //failureRedirect: '/signin'
    }), user.authCallback);

    // Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        //failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), user.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        //failureRedirect: '/signin'
    }), user.authCallback);

    // Setting the linkedin oauth routes
    app.get('/auth/linkedin', passport.authenticate('linkedin', {
        //failureRedirect: '/signin',
        scope: [ 'r_emailaddress' ]
    }), user.signin);

    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        //failureRedirect: '/siginin'
    }), user.authCallback);

};
