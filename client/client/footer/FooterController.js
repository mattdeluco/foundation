/**
 * Created by mdeluco on 2014-06-09.
 */
'use strict';

angular.module('mean.footer').controller('FooterCtrl', [
    '$scope',
    'FootSrvc',
    function ($scope, footSrvc) {
        $scope.email = footSrvc.user.email;
    }
]);