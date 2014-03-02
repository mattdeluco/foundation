'use strict';

angular.module('mean', [
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'mean.system',
    'mean.users'
]);

angular.module('mean.system', []);
angular.module('mean.users', []);