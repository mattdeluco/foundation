'use strict';

angular.module('mean.users').controller('UserCtrl', [
    '$scope',
    function ($scope) {
        $scope.alerts = [
            {
                type: 'info',
                msg: 'This is a flash message.'
            },
            {
                type: 'danger',
                msg: 'Dangah Zone!'
            }
        ];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }
]);