/**
 * Created by mdeluco on 2014-05-26.
 */
'use strict';

var module = angular.module('mean.users', [
    'ngResource',
    'ui.router'
]);

module.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        var access = authAccessLevels.accessLevels;

        $stateProvider
            .state('user', {
                abstract: true,
                template: "<data-ui-view />",
                data: {
                    access: access.user
                }
            })
            .state('user.home', {
                url: '/',
                templateUrl: '/client/users/views/home.html',
                controller: 'UserCtrl'
            })
            .state('user.me', {
                url: '/me/',
                templateUrl: '/client/users/views/me.html',
                controller: 'UserCtrl'
            });

    }
]);

module.factory('UserRsrc', [
    '$resource',
    function($resource) {
        return $resource('/api/users/user', {}, {
            update: {method: 'PUT'},
            save: {method: 'POST'}
        });
    }
]);