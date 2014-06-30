/**
 * Created by mdeluco on 2014-06-10.
 */
'use strict';

var module = angular.module('mean.alerts', []);

module.factory('AlertSrvc', [
    '$rootScope',
    function($rootScope) {
        // TODO It would be nice if individual alerts could be cleared
        // types: success, info (default), warn, danger
        var alertService;
        $rootScope.alerts = {};

        return alertService = {
            addAlerts: function(type, msgs) {
                if (arguments.length < 2) {
                    msgs = type;
                    type = 'info';
                }
                if (!angular.isArray(msgs)) {
                    msgs = [msgs];
                }

                if (!$rootScope.alerts[type]) {
                    $rootScope.alerts[type] = {
                        msgs: msgs,
                        close: function () {
                            alertService.closeAlert(type);
                        }
                    };
                } else {
                    $rootScope.alerts[type].msgs = $rootScope.alerts[type].msgs.concat(msgs);
                }
            },
            closeAlert: function(type) {
                delete $rootScope.alerts[type];
            },
            clearAlerts: function() {
                $rootScope.alerts = {};
            }
        };
    }
]);

module.run([
    '$rootScope',
    '$state',
    'AlertSrvc',
    function (
        $rootScope,
        $state,
        alertSrvc)
    {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            // Note - always set new alerts AFTER go()/statechange
            alertSrvc.clearAlerts();
        });
    }
]);