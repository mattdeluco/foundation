/**
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

var AuthCtrl = require('./AuthController');

module.exports = function(router) {

    router.post('/register', AuthCtrl.register);
    router.post('/signin', AuthCtrl.signin);
    router.get('/signout', AuthCtrl.signout);

};