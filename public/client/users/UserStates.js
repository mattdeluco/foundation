'use strict';

angular.module('mean').config([
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
                state('me.edit', {
                    url: '/me/edit',
                    templateUrl: '/client/users/views/edit.html',
                    controller: 'UserCtrl'
                })
    }
]);