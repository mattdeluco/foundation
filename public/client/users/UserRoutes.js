'use strict';

angular.module('mean').config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.
                state('users', {
                    url: '/users',
                    templateUrl: '/client/users/views/list.html'
                }).
                state('create user', {
                    url: '/users/create',
                    templateUrl: '/client/users/views/create.html',
                    controller: 'UserCtrl'
                }).
                state('edit user', {
                    url: '/users/:userId/edit',
                    templateUrl: '/client/users/views/edit.html'
                }).
                state('view user', {
                    url: '/users/:userId',
                    templateUrl: '/client/users/views/view.html'
                });
    }
]);