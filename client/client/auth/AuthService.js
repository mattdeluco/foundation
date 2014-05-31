/**
 * Taken from https://github.com/fnakstad/angular-client-side-auth
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

angular.module('mean.auth')
    .factory('Auth', [
        '$http',
        '$cookieStore',
        'AuthResource',
        function($http, $cookieStore, authResource){

        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        return {
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser,

            authorize: function(accessLevel, role) {
                if(role === undefined) {
                    role = currentUser.role;
                }

                return accessLevel.bitMask & role.bitMask;
            },

            isLoggedIn: function(user) {
                if(user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title
                    || user.role.title === userRoles.admin.title;
            },

            register: function(user, success, error) {
                authResource.register([], user,
                    function (resource, headers) {
                        changeUser(resource.user);
                        success(user);
                    },
                    function (response) {
                        error(response);
                    }
                );
            },

            login: function(user, success, error) {
                authResource.signin([], user,
                    function (resource, headers) {
                        changeUser(resource.user);
                        success(user);
                    },
                    function (response) {
                        error(response);
                    });
            },

            logout: function(success, error) {
                authResource.signout([], {},
                    function (resource, headers) {
                        changeUser({
                            username: '',
                            role: userRoles.public
                        });
                        success()
                    },
                    function (response) {
                        error(response);
                    });
            }
        };
    }]);
