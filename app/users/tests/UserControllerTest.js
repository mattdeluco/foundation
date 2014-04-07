'use strict';
/**
 * Created by mdeluco on 2014-03-29.
 */

var app = require('../../../server'),
    should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

var user = {
    name: 'Sterling Archer',
    email: 'duchess@isis.com',
    password: 'guest'
};

describe('User Controller', function() {

    before(function(done) {
        done();
    });

    describe('Sign up', function() {

        var url = '/user';
        var agent = request.agent(app);

        it('should sign up a new user', function(done) {
            agent
                .post(url)
                .send(user)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status(201);
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name', user.name);
                    res.body.user.should.have.property('email', user.email);
                    res.body.user.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should be logged in after signing up', function(done) {
            agent
                .get(url)
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name', user.name);
                    res.body.user.should.have.property('email', user.email);
                    res.body.user.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should return an http 400 and error message', function(done) {
            var user = {email: 'foo@example.com', password: ''};

            request(app)
                .post(url)
                .send(user)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message');
                    done();
                });
        });

    });

    describe('Sign in, Sign out', function() {

        var agent = request.agent(app);

        it('should sign in and return a user object', function(done) {
            agent
                .post('/signin')
                .send(_.omit(user, 'name'))
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name', user.name);
                    res.body.user.should.have.property('email', user.email);
                    res.body.user.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should have access to the user object', function(done) {
            agent
                .get('/user')
                .expect(200, done)
        });

        it('should return an error message on failed sign in', function(done) {
            var user_wrong_pw = _.omit(user, ['name', 'password']);
            user_wrong_pw.password = 'notguest';

            request(app)
                .post('/signin')
                .send(user_wrong_pw)
                .expect(401)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('message');
                    done();
                });
        });

        it('should sign out and receive an empty user object', function(done) {
            agent
                .get('/signout')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('user');
                    should.not.exist(res.body.user);
                    done();
                });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});