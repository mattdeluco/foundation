/**
 * Created by mdeluco on 2014-04-27.
 */

'use strict';

angular.module('foundation.directives', []).directive('matchInput',
    function () {
        return {
            restrict: 'A',
            replace: false,
            require: 'ngModel',
            scope: {
                matchInput: '='
            },
            link: function (scope, elem, attrs, ctrl) {
                scope.$watch(function () {
                    return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) ||
                        ctrl.$modelValue === scope.matchInput;
                }, function (currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    }
);