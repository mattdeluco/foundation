/**
 * Created by mdeluco on 2014-06-09.
 */
'use strict';

angular.module('mean.menubar').controller('MenuBarCtrl', [
    '$scope',
    function ($scope) {
        $scope.menu = [{
            'title': 'Articles',
            'link': 'articles'
        }, {
            'title': 'Create New Article',
            'link': 'articles/create'
        }];

        $scope.isCollapsed = false;
    }
]);