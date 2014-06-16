/**
 * Created by mdeluco on 2014-06-09.
 */
'use strict';

angular.module('mean.footer', []);

angular.module('mean.footer').factory('FootSrvc', [
    'AuthSrvc',
    function (authSrvc) {
        return {
            user: authSrvc.user
        };
    }
]);