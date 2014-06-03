'use strict';

/**
 * Module dependencies.
 */
var should = require('should')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , userRoles = require('../../../client/client/auth/AuthAccessLevels').userRoles;

//Globals
var user, user2;

//The tests
describe('User Model', function() {

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
                should.not.exist(err);
                users.should.have.length(0);
                done();
            });
        });

        it('should save without error', function(done) {
            user.save(done);
        });

        it('should save a user with default role user', function () {
            user.should.have.property('role');
            user.role.should.have.properties({
                bitMask: userRoles.user.bitMask,
                title: userRoles.user.title
            });
        });

        it('should fail to save a new user with an existing email address', function(done) {
            user.save();
            return user2.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should save a new user with a different email address', function(done) {
            user.save();
            var user3 = new User(user2);
            user3.email = 'test3@example.com';
            user3.save(done);
        });

        it('should error on empty name', function(done) {
            var userx = new User(user);
            userx.name = '';
            return userx.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should error on empty email', function(done) {
            var userx = new User(user);
            userx.email = '';
            return userx.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should error on empty password', function(done) {
            var userx = new User(user);
            userx.password = '';
            return userx.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    describe('Password', function() {
        it('should store the password as a bcrypt hash', function(done) {
            user.save();
            User.findOne({_id: user.id}, '+hashed_password', function(err, user) {
                should.not.exist(err);
                user.hashed_password.should.startWith('$2a$10$');
                done();
            });
        });

        it('should not return hashed_password in a query', function(done) {
            user.save();
            User.findOne({_id: user.id}, function(err, user1) {
                should.not.exist(err);
                user1.should.have.property('hashed_password', undefined);
                done();
            });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });

});