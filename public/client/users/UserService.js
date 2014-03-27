'use strict';

angular.module('mean.users').factory('Users', [
    '$resource',
    function($resource) {
        return $resource('/user', {}, {
            update: {method: 'PUT'},
            save: {method: 'POST'},
            signin: {method: 'POST', url: '/signin'},
            signout: {method: 'GET', url: '/signout'}
        });
    }
]);