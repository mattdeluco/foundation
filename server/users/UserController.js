'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


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

        user.save(function (err, user /*, nr_affected */) {
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
                console.log(user);
                return res.jsonp(user);
            }
        });
    }

};