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
                    alertSrvc.addAlerts('success', 'Account updated!');
                    $state.go('user.me');
                },
                function(response) {
                    console.log(response.data);
                    alertSrvc.addAlerts(response.data.alert.type, response.data.alert.msg);
                    $state.go('user.me');
                }
            );
        };

    }
]);