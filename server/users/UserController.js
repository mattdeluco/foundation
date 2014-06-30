'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , providers = require('../passport').providers
    , passport = require('passport');


module.exports = {

    signin: function (req, res) {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.redirect('#!/signin');
    },

    authCallback: function (req, res) {
        res.redirect('/');
    },

    update: function (req, res) {

        var user = _.extend(req.user, req.body);
        if (req.body.new_password) {
            user.password = req.body.new_password;
        }

        user.save(function (err, user /*, nr_affected */) {
            if (err) {
                return res.jsonp(500, {
                    alert: {
                        type: 'danger',
                        msg: 'Error saving user: ' + err.message
                    }
                });
            }

            return res.jsonp(user);
        });
    },

    me: function (req, res) {
        User.findById(req.user._id, function (err, user) {
            if (err) {
                return res.jsonp(500, {
                    alert: {
                        type: 'danger',
                        msg: 'Error retrieving user information: ' + err.message
                    }
                });
            }

            if (user) {

                // Populate empty providers for sign up buttons
                var unusedProviders = _.difference(
                    _.keys(providers), _.map(user.providers, 'provider'));

                if (unusedProviders) {
                    _.forEach(unusedProviders, function (provider) {
                        user.providers.push({provider: provider});
                    });
                }

                return res.jsonp(user);
            }
        });
    }

};