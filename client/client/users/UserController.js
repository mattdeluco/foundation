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
                    $state.go('user.me');
                },
                function(response) {
                    $scope.alerts.push(response.data.alert);
                    $state.go('user.me');
                }
            );
        };

    }
]);