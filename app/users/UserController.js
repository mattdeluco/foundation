'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');


exports.create = function(req, res, next, passport) {
    passport.authenticate('local-signup', function(err, user_id, info) {
        if (err) return next(err);
        if (!user_id) return res.json(500, info);
        req.login(user_id, function(err) {
            if (err) return next(err);
            return res.json(201, {
                user_id: req.user._id,
                info: info
            });
        });
    })(req, res, next);
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

exports.update = function(req, res) {
    var user = req.user;

    user = _.extend(user, req.body);

    user.save(function(err) {
        if (err) {
            return res.jsonp(500, {
                alert: {
                    type: 'danger',
                    msg: 'Error saving user: ' + err.message
                }
            });
        }

        res.jsonp(user);
    });
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.jsonp(401, {
        alert: {
            type: 'danger',
            msg: 'Could not sign in.'
        }
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};
