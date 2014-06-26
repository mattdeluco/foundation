/**
 * Created by mdeluco on 2014-06-23.
 */
'use strict';

var filters = angular.module('foundation.filters', []);

filters.filter('breakLongLine', function () {
    return function (longLine) {
        if (!longLine) return longLine;
        var fragments = [];
        for (var i = 0; i < longLine.length; i+=10) {
            fragments.push(longLine.slice(i, i+10))
        }
        return fragments.join('\u200b');
    }
});