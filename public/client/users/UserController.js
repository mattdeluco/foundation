'use strict';

angular.module('mean.users').controller('UserCtrl', [
    '$scope',
    '$location',
    'Users',
    function ($scope, $location, Users) {
        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.user = Users.get({},
            function(resource, headers) {},
            function(respnose) {});

        $scope.signin = function(user) {
            Users.signin([], user,
                function(resource, headers) {
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Welcome back!'
                    });
                    $location.url('/me');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    // TODO on redirect this should display the signin form
                    $location.url('/signup');
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
                        $location.url('/me');
                    },
                    function(response) {
                        $scope.alerts.push(response.data.alert);
                        $location.url('/signup');
                    }
            );
        };
    }
]);