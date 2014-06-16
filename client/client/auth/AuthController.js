/**
 * Created by mdeluco on 2014-06-10.
 */
'use strict';

angular.module('mean.auth').controller('AuthCtrl', [
    '$scope',
    '$state',
    'AlertSrvc',
    'AuthSrvc',
    function ($scope, $state, alertSrvc, authSrvc) {

        $scope.alert = {};
        $scope.isSignedIn = authSrvc.isSignedIn();
        $scope.user = authSrvc.user;

        $scope.register = function (user) {
            authSrvc.register(user,
                function (user) {
                    console.log('one');
                    alertSrvc.addAlerts('success', 'Welcome ' + user.name + '!');
                    console.log('two');
                    $state.go('user.home');
                    console.log('three');
                },
                function (response) {
                    $scope.alert = response.data.error;
                }
            );
        };

        $scope.signin = function (user) {
            authSrvc.signin(user,
                function (user) {
                    alertSrvc.addAlerts('success', 'Welcome back ' + user.name + '!');
                    $state.go('user.home');
                }, function (response) {
                    $scope.alert = response.data.error;
                }
            );
        };

        $scope.signout = function () {
            authSrvc.signout(
                function () {
                    $state.go('anon.signin', null, {reload: true});
                },
                function (response) {
                    var err = response.error;
                    alertSrvc.addAlerts(err.type, err.msg);
                }
            );
        };

    }
]);