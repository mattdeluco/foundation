/**
 * Created by mdeluco on 2014-05-23.
 */
'use strict';

describe('User Controller', function () {

    describe('User Not Signed In', function () {

        var $rootScope,
            $scope,
            $httpBackend,
            controller;

        beforeEach(function () {
            module('mean.users');

            inject(function ($injector) {

                $httpBackend = $injector.get('$httpBackend');
                $httpBackend.when('GET', '/user').respond(401, {
                    error: {
                        type: 'danger',
                        message: 'User is not authorized'
                    }
                });
                $httpBackend
                    .expect('GET', '/client/users/views/create.html')
                    .respond(200);

                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                controller = $injector.get('$controller')('UserCtrl', {$scope: $scope});

                $httpBackend.flush();

            });
        });

        it('should alert the user', function () {
            expect($scope.alerts.length).toBe(1);
            expect($scope.alerts.type).toBe('danger');
            expect($scope.alerts.message).toBe('User is not authorized');
        });

    });

    describe('User Signed In', function () {

        var $rootScope,
            $scope,
            $httpBackend,
            controller;

        beforeEach(function () {
            module('mean.users');

            inject(function ($injector) {

                $httpBackend = $injector.get('$httpBackend');
                $httpBackend.when('GET', '/user').respond(200, {
                    user: {
                        name: 'Sterling Archer',
                        username: 'duchess',
                        email: 'duchess@isis.org'
                    }
                });

                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                controller = $injector.get('$controller')('UserCtrl', {$scope: $scope});

                $httpBackend.flush();

            });
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should have no alerts', function () {
            expect($scope.alerts.length).toBe(0);
        });

        it('should have a user', function () {
        });

    });

});