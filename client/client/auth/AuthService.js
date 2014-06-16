/**
 * Borrowed from https://github.com/fnakstad/angular-client-side-auth
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

angular.module('mean.auth')
    .factory('AuthSrvc', [
        '$location',
        '$window',
        '$http',
        function($location, $window, $http){

            var accessLevels = authAccessLevels.accessLevels
                , userRoles = authAccessLevels.userRoles;

            var anonUser = {
                _id: '',
                name: '',
                email: '',
                username: '',
                role: userRoles.public
            };

            var currentUser = $window.user || anonUser;

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

                isSignedIn: function(user) {
                    if(user === undefined) {
                        user = currentUser;
                    }
                    return user.role.title === userRoles.user.title
                        || user.role.title === userRoles.admin.title;
                },

                register: function(user, success, error) {
                    $http.post('/api/auth/register', user)
                        .success(function (data, status, headers, config) {
                            changeUser(data);
                            success(user);
                        })
                        .error(error);
                },

                signin: function(user, success, error) {
                    $http.post('/api/auth/signin', user)
                        .success(function (data, status, headers, config) {
                            changeUser(data.user);
                            success(currentUser);
                            if (data.redirect) {
                                if ($window.location.href === data.redirect) {
                                    //This is so an admin user will get full admin page
                                    $window.location.reload();
                                } else {
                                    $window.location = data.redirect;
                                }
                            } else {
                                $location.url('/');
                            }
                        })
                        .error(error);  // data, status, headers, config
                },

                signout: function(success, error) {
                    $http.get('/api/auth/signout')
                        .success(function (data, status, headers, config) {
                            changeUser(anonUser);
                            success();
                        })
                        .error(error);
                }
            };
        }
    ]);
