/**
 * Created by mdeluco on 2014-07-01.
 */
'use strict';

describe('Break Long Line Filter', function () {

    beforeEach(function () {
        angular.mock.module('mean')
    });

    it('should return the same falsy value passed in', inject(function ($filter) {
        var filter = $filter('breakLongLine');
        expect(filter()).to.be.undefined;
        expect(filter(null)).to.be.null;
        expect(filter(false)).to.be.false;
        expect(filter('')).to.equal('');
        expect(filter(0)).to.equal(0);
    }));

    it('should do nothing for a string <= 10 chars', inject(function ($filter) {
        var str = '0123456879';
        var filtered = $filter('breakLongLine')(str);
        expect(filtered).to.not.have.string('\u200b');
        expect(filtered).to.equal(str);
    }));

    it('should break a string > 10 chars with a zero-width space (u200b)', inject(function ($filter) {
        var str1 = '0123456789';
        var str2 = '0';
        var filtered = $filter('breakLongLine')(str1 + str2);
        expect(filtered).to.have.string('\u200b');
        expect(filtered).to.equal(str1 + '\u200b' + str2);
    }));

});