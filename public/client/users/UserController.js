'use strict';

angular.module('mean.users').controller('UserCtrl', [
    '$scope',
    '$state',
    'Global',
    'Users',
    function ($scope, $state, Global, Users) {
        $scope.global = Global;

        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.user = Users.get({},
            function(resource, headers) {
                $scope.global.user = resource.user;
            },
            function(respnose) {});

        $scope.signin = function(user) {
            Users.signin([], user,
                function(resource, headers) {
                    $scope.global.user = resource.user;
                    $scope.global.authenticated = true;
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Welcome back!'
                    });
                    $state.transitionTo('me');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    // TODO on redirect this should display the signin form
                    $state.transitionTo('signup');
                }
            );
        };

        $scope.signout = function() {
            Users.signout([], null,
                function(resource, headers) {
                    $scope.global.user = null;
                    $scope.global.authenticated = false;
                    $state.transitionTo('home');
                },
                function(response) {
                    // TODO
                }
            );
        };

        $scope.save = function(user) {
            Users.save([], user,
                    function(resource, headers) {
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'Account created, welcome!'
                        });
                        $state.transitionTo('me');
                    },
                    function(response) {
                        $scope.alerts.push(response.data.alert);
                        $state.transitionTo('signup');
                    }
            );
        };
    }
]);