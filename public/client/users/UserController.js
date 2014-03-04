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

        $scope.save = function(user) {
            Users.save([], user,
                    function(new_user, postResponseHeaders) {
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'Created user with email: ' + new_user.email
                        });
                        console.log(postResponseHeaders());
                        $location.url('/users/' + new_user._id);
                    },
                    function(postResponse) {
                        $scope.alerts.push({
                            type: 'danger',
                            msg: 'Error creating user: ...'
                        });
                        console.log(postResponse());
                    }
            );
        };
    }
]);