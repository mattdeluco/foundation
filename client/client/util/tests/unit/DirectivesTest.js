/**
 * Created by mdeluco on 2014-07-01.
 */
'use strict';

describe('Directives', function () {

    var scope, form;
    var password = 'abc123';

    beforeEach(function () {
        angular.mock.module('mean');

        inject([
            '$compile',
            '$rootScope',
            function ($compile, $rootScope) {
                scope = $rootScope.$new();
                scope.user = {};

                var element = angular.element(
                    '<form name="testForm">' +
                        '<input data-ng-model="user.password" data-match-input="user.password_repeat" name="password" id="password" />' +
                        '<input data-ng-model="user.password_repeat" name="password_repeat" id="password_repeat" />' +
                    '</form>'
                );

                $compile(element)(scope);
                form = scope.testForm;
            }
        ]);
    });


    it('should initially be valid', function (done) {
        expect(form.$valid).to.be.true;
        expect(form.password.$error.match).to.be.undefined;
        done();
    });

    it('should be invalid when fields are mismatched (starting with directive field)', function (done) {
        form.password.$setViewValue(password);
        scope.$digest();
        expect(form.password.$error.match).to.be.true;
        expect(form.password.$valid).to.be.false;

        form.password_repeat.$setViewValue(password + 'x');
        scope.$digest();
        expect(form.password.$error.match).to.be.true;
        expect(form.password.$valid).to.be.false;

        done();
    });

    it('should be invalid when fields are mismatched (starting with non-directive field)', function (done) {
        form.password_repeat.$setViewValue(password);
        scope.$digest();
        expect(form.password.$error.match).to.be.true;
        expect(form.password.$valid).to.be.false;

        form.password.$setViewValue(password + 'x');
        scope.$digest();
        expect(form.password.$error.match).to.be.true;
        expect(form.password.$valid).to.be.false;

        done();
    });

    it('should be valid when fields are matched', function (done) {
        form.password.$setViewValue(password);
        form.password_repeat.$setViewValue(password);
        scope.$digest();
        expect(form.password.$error.match).to.be.false;
        expect(form.password.$valid).to.be.true;
        expect(form.$valid).to.be.true;
        done();
    });

});