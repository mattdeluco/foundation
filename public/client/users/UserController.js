'use strict';

angular.module('mean.users').controller('UserCtrl', [
    '$scope',
    '$state',
    'Global',
    'UserResource',
    function ($scope, $state, Global, Users) {

        $scope.global = Global;

        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.user = Users.get({},
            function(resource, headers) {
                $scope.global.user = resource.user;
                $scope.user = resource.user;
            },
            function(response) {
                $scope.alerts.push(response.data.error);
                $state.transitionTo('signup');
                $scope.showSignin = true;
            }
        );

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
                    $scope.alerts.push(response.data.alert);
                    $state.transitionTo('home');
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

        $scope.update = function(user) {
            Users.update([], user,
                function(resource, headers) {
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Account updated!'
                    });
                    $state.transitionTo('me');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    $state.transitionTo('me');
                }
            );
        };

    }
]);