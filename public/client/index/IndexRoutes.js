'use strict';

angular.module('mean').config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.
            state('index', {
                url: '/',
                templateUrl: '/client/index/views/index.html',
                controller: 'IndexController'
            });
    }
]);