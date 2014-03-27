'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

//Globals
var user, user2;

//The tests
describe('<Unit Test>', function() {
    describe('Model User:', function() {
        before(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@example.com',
                username: 'user',
                password: 'password',
                provider: 'local'
            });
            user2 = new User({
                name: 'Full name',
                email: user.email,
                username: 'user',
                password: 'password',
                provider: 'local'
            });

            done();
        });

        describe('Method Save', function() {
            it('should begin with no users', function(done) {
                User.find({}, function(err, users) {
                    users.should.have.length(0);
                    done();
                });
            });

            it('should be able to save whithout problems', function(done) {
                user.save(done);
            });

            it('should save a new user with a different email address', function(done) {
                user.save();
                var user3 = new User(user2);
                user3.email = 'test3@example.com';
                user3.save(done);
            });

            it('should fail to save a new user with an existing email address', function(done) {
                user.save();
                return user2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without name', function(done) {
                user.name = '';
                return user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        after(function(done) {
            User.remove().exec();
            done();
        });
    });
});