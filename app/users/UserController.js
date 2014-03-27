'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


exports.create = function(req, res) {
    var user = new User(req.body);

    user.save(function(err) {
        if (err) {
            return res.jsonp(500, {
                alert: {
                    type: 'danger',
                    msg: 'Error saving user: ' + err.message
                }
            });
        }

        User.findOne({_id: user._id}, function(err, user) {
            if (err) {
                return res.jsonp(500, {
                    alert: {
                        type: 'danger',
                        msg: 'Error loading new user: ' + err.message
                    }
                });
            }

            req.login(user, function(err) {
                if (err) {
                    return res.json(401, {
                        alert: {
                            type: 'danger',
                            msg: 'Could not sign in new user: ' + err.message
                        }
                    });
                }

                return res.jsonp(201, user);
            });
        });
    });
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
    res.jsonp({
        user: req.user
    });
};
