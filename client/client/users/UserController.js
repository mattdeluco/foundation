'use strict';

angular.module('mean.users').controller('UserCtrl', [
    '$scope',
    '$state',
    '$http',
    'AlertSrvc',
    'UserRsrc',
    function ($scope, $state, $http, alertSrvc, userRsrc) {

        $scope.profilePairs = [];

        $scope.user = userRsrc.get({},
            function (resource, headers) {
                var providers = resource.providers;
                for (var i = 0; i < providers.length; i++) {
                    $scope.profilePairs.push(providers.slice(i+i, i+(i+2)));
                }
            },
            function (response) {
                alertSrvc.addAlerts(response.alert.type, response.alert.msg);
            }
        );

        $scope.update = function(user) {
            userRsrc.update([], user,
                function(resource, headers) {
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Account updated!'
                    });
                    $state.go('me');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    $state.go('me');
                }
            );
        };

        /*
        $scope.user = Users.get({},
            function(resource, headers) {
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
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Welcome back!'
                    });
                    $state.go('me');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    // TODO on redirect this should display the signin form
                    $state.go('signup');
                }
            );
        };

        $scope.signout = function() {
            Users.signout([], null,
                function(resource, headers) {
                    $state.go('home');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    $state.go('home');
                }
            );
        };

        $scope.register = function(user) {
            Users.save([], user,
                    function(resource, headers) {
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'Account created, welcome!'
                        });
                        $state.go('me');
                    },
                    function(response) {
                        $scope.alerts.push(response.data.alert);
                        $state.go('signup');
                    }
            );
        };
        */

    }
]);