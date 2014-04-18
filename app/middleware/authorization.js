'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.jsonp(401, {
            error: { message: 'User is not authorized'}
        });
    }
    next();
};