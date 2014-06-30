'use strict';

// User routes use users controller
var UserCtrl = require('./UserController')
    , passport = require('passport')
    , accessLevels = require('../../client/client/auth/AuthAccessLevels').accessLevels
    , isAuthorized = require('../auth/AuthMiddleware').isAuthorized;

module.exports = function(router) {

    router.get('/user', isAuthorized(accessLevels.user), UserCtrl.me);
    router.put('/user',
        isAuthorized(accessLevels.user),
        function (req, res, next) {
            if (req.body.new_password) {
                passport.authenticate('local', function (err, user, info) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return res.jsonp(401, {
                            alert: {
                                type: 'danger',
                                msg: 'Could not change password - old password incorrect'
                            }
                        });
                    }

                    return next();

                })(req, res, next);
            } else {
                return next();
            }
        },
        UserCtrl.update);

};
