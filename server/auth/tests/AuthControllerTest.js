/**
 * Created by mdeluco on 2014-05-28.
 */
'use strict';

var app = require('../../../server')
    , expect = require('chai').expect
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
                .expect(200)
                .end(function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.contain({
                        name: user.name,
                        email: user.email
                    });
                    expect(res.body).to.have.property('role');
                    expect(res.body.role).to.contain(userRoles.user);
                    expect(res.body).to.not.have.property('hashed_password');
                    done();
                });
        });

        it('should have the user logged in after registration', function(done) {
            agent
                .get('/api/users/user')
                .expect(200)
                .end(function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.contain({
                        name: user.name,
                        email: user.email
                    });
                    expect(res.body).to.have.property('role');
                    expect(res.body.role).to.contain(userRoles.user);
                    expect(res.body).to.not.have.property('hashed_password');
                    done();
                });

        });

        // TODO Test various model validations
        it('should require a password on registration', function(done) {
            var user = {email: 'foo@example.com', password: ''};

            request(app)
                .post('/api/auth/register')
                .send(user)
                .expect(400)
                .end(function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.contain.keys('type', 'msg');
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
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.contain({
                        name: user.name,
                        email: user.email
                    });
                    expect(res.body.user).to.have.property('role');
                    expect(res.body.user.role).to.contain(userRoles.user);
                    expect(res.body.user).to.not.have.property('hashed_password');
                    done();
                });
        });

        it('should sign out successfully', function(done) {
            agent
                .post('/api/auth/signout')
                .expect(200)
                .end(function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.not.contain.keys('name', 'email', 'role');
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
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.contain.keys('type', 'msg');
                    done();
                });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});