'use strict';

// User routes use users controller
var user = require('./UserController');
var auth = require('./../middleware/authorization');

module.exports = function(app, passport) {

    app.post('/user', user.create_user);
    app.get('/user', auth.requiresLogin, user.me);
    app.put('/user', auth.requiresLogin, user.update);

    // Local authentication
    app.post(
        '/signin',
        function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) return next(err);
                if (!user) {
                    return res.jsonp(401, { error: info });
                }
                req.login(user, function(err) {
                    if (err) return next(err);
                    return res.jsonp({ user: user });
                });
            })(req, res, next);
        }
    );

    app.get('/signout', user.signout);

    // Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        failureFlash: true,
        scope: ['email', 'user_about_me']
    }), user.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureFlash: true
    }), user.signin);

    // Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureFlash: true
    }), user.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureFlash: true
    }), user.signin);

    // Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureFlash: true
    }), user.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureFlash: true
    }), user.signin);

    // Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureFlash: true,
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), user.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureFlash: true
    }), user.signin);

    // Setting the linkedin oauth routes
    app.get('/auth/linkedin', passport.authenticate('linkedin', {
        failureFlash: true,
        scope: [ 'r_emailaddress' ]
    }), user.signin);

    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        failureFlash: true
    }), user.signin);

};