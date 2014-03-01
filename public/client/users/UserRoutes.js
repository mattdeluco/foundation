'use strict';

angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/users', {
                    templateUrl: 'users/views/list.html'
                }).
                when('/users/create', {
                    templateUrl: 'users/views/create.html'
                }).
                when('/users/:articleId/edit', {
                    templateUrl: 'users/views/edit.html'
                }).
                when('/users/:articleId', {
                    templateUrl: 'users/views/view.html'
                }).
                when('/', {
                    templateUrl: 'index/views/index.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }
]);