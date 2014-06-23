'use strict';

/**
 * Module dependencies.
 */
var should = require('should')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , userRoles = require('../../../client/client/auth/AuthAccessLevels')
        .userRoles;


var user, user2;


describe('User Model', function() {

    before(function(done) {
        user = new User({
            name: 'Full name',
            email: 'test@example.com',
            username: 'user',
            password: 'password'
        });
        user2 = new User({
            name: 'Full name',
            email: user.email,
            username: user.username,
            password: 'password'
        });

        done();
    });

    describe('Saving a new user', function() {

        it('should begin with no users', function (done) {
            User.find({}, function (err, users) {
                should.not.exist(err);
                users.should.have.length(0);
                done();
            });
        });

        it('should save without error', function (done) {
            user.save(done);
        });

        it('should save a user with default role user', function (done) {
            user.should.have.property('role');
            user.role.should.have.properties({
                bitMask: userRoles.user.bitMask,
                title: userRoles.user.title
            });
            done();
        });

        it('should save a user with a default provider of local', function (done) {
            user.should.have.property('provider', 'local');
            done();
        });

    });

    describe('Unique Fields', function () {

        it('should fail to save a new user with a duplicate email address', function (done) {
            user2.save(function (err) {
                should.exist(err);
                err.should.have.property('code', 11000);
                done();
            });
        });

        it('should not save a new user with a duplicate username', function (done) {
            user2.save(function (err) {
                should.exist(err);
                err.should.have.property('code', 11000);
                done();
            });
        });

        it('should save a new user with unique fields', function (done) {
            user2.email = 'test2@example.com';
            user2.username = 'user2';
            user2.save(done);
        });

    });

    describe('Required Fields', function() {

        it('should error on empty name', function(done) {
            var userx = new User(user);
            userx.name = '';
            userx.save(function(err) {
                should.exist(err);
                err.should.have.property('name', 'ValidationError');
                err.errors.should.have.property('name');
                done();
            });
        });

        it('should error on empty email', function(done) {
            var userx = new User(user);
            userx.email = '';
            userx.save(function(err) {
                should.exist(err);
                err.should.have.property('name', 'ValidationError');
                err.errors.should.have.property('email');
                done();
            });
        });

        it('should error on empty hashed_password', function(done) {
            var userx = new User(user);
            userx.password = '';
            userx.save(function(err) {
                should.exist(err);
                err.should.have.property('name', 'ValidationError');
                err.errors.should.have.property('hashed_password');
                done();
            });
        });

        it('should not error on empty hashed_password with non-local provider', function (done) {
            var userx = new User({
                name: 'Sterling Archer',
                username: 'duchess',
                email: 'duchess@example.com',
                provider: 'facebook'
            });
            userx.provider = 'facebook';
            userx.password = '';
            userx.save(done);
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