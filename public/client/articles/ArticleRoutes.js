'use strict';

angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/articles', {
                    templateUrl: 'views/articles/list.html'
                }).
                when('/articles/create', {
                    templateUrl: 'views/articles/create.html'
                }).
                when('/articles/:articleId/edit', {
                    templateUrl: 'views/articles/edit.html'
                }).
                when('/articles/:articleId', {
                    templateUrl: 'views/articles/view.html'
                });
    }
]);