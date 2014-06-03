/**
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

var app = require('../../../server')
    , should = require('should')
    , request = require('supertest')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , _ = require('lodash')
    , accessLevels = require('../../../client/client/auth/AuthAccessLevels').accessLevels
    , userRoles = require('../../../client/client/auth/AuthAccessLevels').userRoles;

var user = {
    name: 'Sterling Archer',
    email: 'duchess@isis.com',
    password: 'guest'
};

describe('Auth Controller', function() {

    before(function(done) {
        done();
    });

    describe('Register', function() {

        var agent = request.agent(app);

        it('should register a new user', function(done) {
            agent
                .post('/api/auth/register')
                .send(user)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.have.property('name', user.name);
                    res.body.should.have.property('email', user.email);
                    res.body.should.have.property('role');
                    res.body.role.should.containDeep(userRoles.user);
                    res.body.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should have the user logged in after registration', function(done) {
            agent
                .get('/api/users/user')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('name', user.name);
                    res.body.should.have.property('email', user.email);
                    res.body.should.have.property('role');
                    res.body.role.should.containDeep(userRoles.user);
                    res.body.should.not.have.property('hashed_password');
                    done();
                });

        });

        // TODO Test various model validations
        it('should return an http 400 and error message', function(done) {
            var user = {email: 'foo@example.com', password: ''};

            request(app)
                .post('/api/auth/register')
                .send(user)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('type');
                    res.body.error.should.have.property('message');
                    done();
                });
        });

    });

    describe('Sign in, Sign out', function() {

        var agent = request.agent(app);

        it('should sign in and return a user object', function(done) {
            agent
                .post('/api/auth/signin')
                .send(_.omit(user, 'name'))
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('name', user.name);
                    res.body.should.have.property('email', user.email);
                    res.body.should.have.property('role');
                    res.body.role.should.containDeep(userRoles.user);
                    res.body.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should have access to the user object', function(done) {
            agent
                .get('/api/users/user')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('name', user.name);
                    res.body.should.have.property('email', user.email);
                    res.body.should.have.property('role');
                    res.body.role.should.containDeep(userRoles.user);
                    res.body.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should sign out successfully', function(done) {
            agent
                .post('/api/auth/signout')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.not.have.properties('name', 'email', 'role');
                    done();
                });
        });

        it('should return an error message on failed sign in', function(done) {
            var user_wrong_pw = _.omit(user, ['name', 'password']);
            user_wrong_pw.password = 'notguest';

            request(app)
                .post('/api/auth/signin')
                .send(user_wrong_pw)
                .expect(401)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('type');
                    res.body.error.should.have.property('message');
                    done();
                });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});