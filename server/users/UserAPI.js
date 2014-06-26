'use strict';

// User routes use users controller
var UserCtrl = require('./UserController')
    , accessLevels = require('../../client/client/auth/AuthAccessLevels').accessLevels
    , isAuthorized = require('../auth/AuthMiddleware').isAuthorized;

module.exports = function(router) {

    router.get('/user', isAuthorized(accessLevels.user), UserCtrl.me);
    router.put('/user', isAuthorized(accessLevels.user), UserCtrl.update);

};
