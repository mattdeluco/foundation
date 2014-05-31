/**
 * Taken from https://github.com/fnakstad/angular-client-side-auth
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
                template: "<ui-view/>",
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
                controller: 'LoginCtrl'
            })
            .state('anon.register', {
                url: '/register/',
                templateUrl: '/client/auth/views/register.html',
                controller: 'RegisterCtrl'
            });

        // Regular user routes
        $stateProvider
            .state('user', {
                abstract: true,
                template: "<data-ui-view />",
                data: {
                    access: access.user
                }
            })
            .state('user.home', {
                url: '/',
                templateUrl: '/client/auth/views/home.html'
            })
            .state('user.me', {
                abstract: true,
                url: '/me/',
                templateUrl: '/client/auth/views/me.html'
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

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function($q, $location) {
            return {
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });

    }
]);

module.factory('AuthResource', [
    '$resource',
    function($resource) {
        return $resource('/user', {}, {
            register: {method: 'POST'},
            signin: {method: 'POST', url: '/signin'},
            signout: {method: 'GET', url: '/signout'}
        });
    }
]);

module.run([
    '$rootScope',
    '$state',
    'Auth',
    function (
        $rootScope,
        $state,
        Auth)
    {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!Auth.authorize(toState.data.access)) {
                $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                event.preventDefault();

                if(fromState.url === '^') {
                    if(Auth.isLoggedIn()) {
                        $state.go('user.home');
                    } else {
                        $rootScope.error = null;
                        $state.go('anon.login');
                    }
                }
            }
        });

    }
]);
