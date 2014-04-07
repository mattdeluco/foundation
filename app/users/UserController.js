'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


exports.create_user = function(req, res) {
    var user = new User(req.body);

    user.save(function(err) {
        if (err) {
            return res.jsonp(400, {
                error: {
                    message: 'Error saving user: ' + err.message
                }
            });
        }

        User.findOne({_id: user._id}, function(err, user) {
            if (err) {
                return res.jsonp(500, {
                    error: {
                        message: 'Error loading new user: ' + err.message
                    }
                });
            }

            req.login(user, function(err) {
                if (err) {
                    return res.json(401, {
                        error: {
                            message: 'Could not sign in new user: ' + err.message
                        }
                    });
                }

                return res.jsonp(201, {user: user});
            });
        });
    });
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

exports.me = function(req, res) {
    res.jsonp({ user: req.user });
};

exports.signin = function(req, res) {
    var flash_message = req.flash('error');

    if (flash_message.length) {
        return res.jsonp(400, {
            error: { message: flash_message }
        });
    }

    res.jsonp({ user: req.user });
};

exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

