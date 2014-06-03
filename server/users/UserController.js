'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


module.exports = {

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
        return res.jsonp(req.user);
    }

};