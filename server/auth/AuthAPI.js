/**
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

var passport = require('passport')
    , providers = require('../passport').providers
    , AuthCtrl = require('./AuthController')
    , _ = require('lodash');

module.exports = function(router) {

    router.post('/register', AuthCtrl.register);
    router.post('/signin', AuthCtrl.signin);
    router.get('/signout', AuthCtrl.signout);
    router.get('/providers', AuthCtrl.providers);

    /***
     * Creates these routes for configured passport providers:
     *   /provider
     *   /provider/callback
     *   /provider/unlink
     */
    _.forEach(providers, function (provider, name) {
        router.get('/' + name, passport.authenticate(name, {
            successRedirect: '/',
            failureRedirect: '#!/signin',
            scope: provider.scope
        }));

        router.get('/' + name + '/callback', passport.authenticate(name, {
            successRedirect: '/',
            failureRedirect: '#!/signin'
        }));

        router.get('/' + name + '/unlink', function (req, res) {
            AuthCtrl.unlink(req, res, name);
        });
    });

};