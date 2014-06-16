/**
 * Borrowed from https://github.com/fnakstad/angular-client-side-auth
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

var module = angular.module('mean.auth', ['ngCookies', 'ui.router']);

module.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    function (
        $stateProvider,
        $urlRouterProvider,
        $locationProvider,
        $httpProvider)
    {

        var access = authAccessLevels.accessLevels;

        // Public routes
        $stateProvider
            .state('public', {
                abstract: true,
                template: "<data-ui-view/>",
                data: {
                    access: access.public
                }
            })
            .state('public.404', {
                url: '/404/',
                templateUrl: '/client/auth/views/404.html'
            });

        // Anonymous routes
        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<data-ui-view />",
                data: {
                    access: access.anon
                }
            })
            .state('anon.signin', {
                url: '/signin/',
                templateUrl: '/client/auth/views/signin.html',
                controller: 'AuthCtrl'
            })
            .state('anon.register', {
                url: '/register/',
                templateUrl: '/client/auth/views/register.html',
                controller: 'AuthCtrl'
            });

        $urlRouterProvider.otherwise('/404');

        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function($injector, $location) {
            if($location.protocol() === 'file')
                return;

            var path = $location.path()
            // Note: misnomer. This returns a query object, not a search string
                , search = $location.search()
                , params
                ;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function(v, k){
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

        //$locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function($q, $location) {
            return {
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        });

    }
]);

module.run([
    '$rootScope',
    '$state',
    'AlertSrvc',
    'AuthSrvc',
    function (
        $rootScope,
        $state,
        alertSrvc,
        authSrvc)
    {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!authSrvc.authorize(toState.data.access)) {

                event.preventDefault();

                if(fromState.url === '^') {
                    if(authSrvc.isSignedIn()) {
                        $state.go('user.home');
                    } else {
                        alertSrvc.clearAlerts();
                        $state.go('anon.signin');
                    }
                } else {
                    alertSrvc.addAlerts('warning', 'Sorry, we can\'t show you that!');
                }
            }
        });

    }
]);
