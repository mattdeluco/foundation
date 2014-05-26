/**
 * Created by mdeluco on 2014-04-27.
 */

'use strict';

angular.module('mean.users').directive(
    'snInputMatch',
    function() {
        return {
            restrict: 'A',
            replace: false,
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var checker = function () {
                    return scope.$eval(attrs.ngModel) == scope.$eval(attrs.snInputMatch);
                };

                scope.$watch(checker, function (value) {
                    ctrl.$setValidity('unique', value);
                });
            }
        }
    }
);