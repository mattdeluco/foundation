'use strict';

angular.module('mean', [
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ui.router'
    , 'mean.alerts'
    , 'mean.auth'
    , 'mean.menubar'
    , 'mean.footer'
    , 'mean.users'
    , 'foundation.filters'
//    , 'mean.articles'
]);

angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);