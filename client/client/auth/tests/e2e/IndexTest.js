/**
 * Created by mdeluco on 2014-07-01.
 */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.use(chaiAsPromised).expect;

describe('Index Test', function () {

    var ptor = protractor.getInstance();

    describe('Basic', function () {

        it('should display the title', function () {
            ptor.get('/#!');
            expect(ptor.getTitle()).to.eventually.equal('MyApp');
        });

    });
});