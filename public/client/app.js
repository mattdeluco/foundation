'use strict';

angular.module('mean', [
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'mean.system',
    'mean.users'
    //, 'mean.articles'
]);

angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

angular.module('mean.system', []);