'use strict';

angular.module('mean', [
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ui.router'
    , 'mean.alerts'
    , 'mean.menubar'
    , 'mean.footer'
    , 'mean.auth'
    //, 'mean.users'
    //, 'mean.articles'
]);

angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);