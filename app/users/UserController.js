'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');


exports.users = function(req, res) {
    User.find().exec(function(err, users) {
        if (err) {
            res.render('error', {
                'status': 500
            });
        }

        res.jsonp(users);
    });
};

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
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/views/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/views/signup', {
        title: 'Sign up',
        user: new User()
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
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};