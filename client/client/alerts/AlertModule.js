/**
 * Created by mdeluco on 2014-06-10.
 */
'use strict';

angular.module('mean.alerts', [])
    .factory('alerts', [
        '$rootScope',
        function($rootScope) {
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
                }
            };
        }
    ]);

