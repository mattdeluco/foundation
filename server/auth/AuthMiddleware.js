'use strict';

var accessLevels = require('../../client/client/auth/AuthAccessLevels').accessLevels
    , userRoles = require('../../client/client/auth/AuthAccessLevels').userRoles;

module.exports = {

    isAuthorized: function(accessLevel) {

        if (typeof accessLevel === 'undefined')
            accessLevel = accessLevels.admin;

        return function(req, res, next) {
            var role = userRoles.public;

            if(req.user)
                role = req.user.role;

            if(accessLevel.bitMask & role.bitMask)
                return next();

            res.send(403);
        };
    }

};