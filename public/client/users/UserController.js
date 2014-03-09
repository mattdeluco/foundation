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
                    function(resource, headers) {
                        console.log(resource);
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'Account created, welcome!'
                        });
                        $location.url('/users/' + resource.user_id);
                    },
                    function(response) {
                        $scope.alerts.push(response.data.alert);
                        $location.url('/users/create');
                    }
            );
        };
    }
]);