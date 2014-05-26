/**
 * Created by mdeluco on 2014-05-25.
 */
'use strict';

describe('Global Service', function () {
    var global;

    beforeEach(function () {
        module('mean.system');

        inject(function ($injector) {
            global = $injector.get('Global');
        });
    });

    it('should have a global service', inject(function (Global) {
        expect(global).toBeDefined();
        expect(global).toBe(Global);
    }));

});