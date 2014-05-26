/**
 * Created by mdeluco on 2014-05-26.
 */
'use strict';

var module = angular.module('mean.users', [
    'mean.system',
    'ngResource',
    'ui.router'
]);

module.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.
            state('signup', {
                url: '/signup',
                templateUrl: '/client/users/views/create.html',
                controller: 'UserCtrl'
            }).
            state('me', {
                url: '/me',
                templateUrl: '/client/users/views/view.html',
                controller: 'UserCtrl'
            }).
            state('edit', {
                url: '/me/edit',
                templateUrl: '/client/users/views/edit.html',
                controller: 'UserCtrl'
            });
    }
]);

module.factory('UserResource', [
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