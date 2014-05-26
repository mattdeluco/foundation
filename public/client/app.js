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

angular.module('mean.system', []);
angular.module('mean.users', [
    'mean.system',
    'ngResource',
    'ui.router'
]);
//angular.module('mean.articles', []);