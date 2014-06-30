'use strict';

angular.module('mean.users').controller('UserCtrl', [
    '$scope',
    '$state',
    'AlertSrvc',
    'UserRsrc',
    function ($scope, $state, alertSrvc, userRsrc) {

        $scope.profilePairs = [];

        $scope.user = userRsrc.get({},
            function (resource, headers) {
                var providers = resource.providers;
                for (var i = 0; i < providers.length; i++) {
                    $scope.profilePairs.push(providers.slice(i+i, i+(i+2)));
                }
            },
            function (response) {
                // TODO What to do here?  Auth should keep user from getting this far.
                $state.go('anon.signin');
                alertSrvc.addAlerts(response.alert.type, response.alert.msg);
            }
        );

        $scope.update = function(user) {
            userRsrc.update([], user,
                function(resource, headers) {
                    $state.go('user.me');
                    alertSrvc.addAlerts('success', 'Account updated!');
                },
                function(response) {
                    $state.go('user.me');
                    alertSrvc.addAlerts(response.data.alert.type, response.data.alert.msg);
                }
            );
        };

    }
]);