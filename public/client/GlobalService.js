'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [
    function() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: !! window.user,
            site: {
                title: 'MEAN',
                tagline: 'dustjs-linkedin fork'
            }
        };

        return _this._data;
    }
]);
