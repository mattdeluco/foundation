/**
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

var passport = require('passport')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , providers = require('../passport').providers
    , _ = require('lodash');

module.exports = {

    register: function(req, res, next) {

        var user = new User(req.body);

        user.save(function(err) {
            if (err) {
                return res.jsonp(400, {
                    error: {
                        type: 'danger',
                        msg: 'Error saving user: ' + err.message
                    }
                });
            }

            User.findOne({_id: user._id}, function(err, user) {
                if (err) {
                    return res.jsonp(500, {
                        error: {
                            type: 'danger',
                            msg: 'Error loading new user: ' + err.message
                        }
                    });
                }

                req.login(user, function(err) {
                    if (err) return next(err);
                    return res.jsonp(200, user);
                });
            });
        });
    },

    signin: function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {

            if (err) return next(err);
            if (!user) {
                return res.jsonp(401, {
                    error: {
                        type: 'danger',
                        msg: info.msg
                    }
                });
            }

            req.login(user, function(err) {
                if (err) return next(err);

                if(req.body.rememberme)
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;

                res.jsonp({
                    user: user,
                    redirect: req.get('referer')
                });
            });

        })(req, res, next);
    },

    signout: function(req, res) {
        req.logout();
        res.redirect('/');
    },

    unlink: function (req, res, provider) {
        User.findByIdAndUpdate(
            req.user._id,
            {$pull: {'providers': {'provider': provider}}},
            {},
            function (err, user) {
                if (err) console.log(err);
                res.redirect('/');
            }
        );
    },

    /***
     * Replies with the available/configured providers (not the providers the
     * user is currently subscribed to, which are included in /user).
     * @param req
     * @param res
     */
    providers: function (req, res) {
        res.jsonp(_.keys(providers));
    }

};