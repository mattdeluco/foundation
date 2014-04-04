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

var agent = request.agent(app);

describe('User Controller', function() {

    before(function(done) {
        done();
    });

    describe('user.create', function() {

        var url = '/user';

        it('should create a new user', function(done) {
            request(app).post(url).send(user).end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                res.body.should.have.properties('name', 'email');
                res.body.should.not.have.property('hashed_password');
                done();
            });
        });

        // TODO fix this - posts an existing email address
        it('should return an http 500 and error message', function(done) {
            var user = {email: 'foo@example.com', password: ''};

            request(app).post(url).send(user).end(function(err, res) {
                should.not.exist(err);
                res.should.have.status(500);
                res.body.should.have.property('alert');
                res.body.alert.should.have.properties('type', 'msg');
                done();
            });
        });

    });

    describe('user.signin', function() {

        var url = '/signin';

        it('should signin and return a user object', function(done) {
            agent
                .post(url)
                .send(_.omit(user, 'name'))
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('user');
                    res.body.user.should.have.properties('name', 'email');
                    done();
                });
        });
    });

    describe('user.me', function() {

        var url = '/user';

        it('should return a user object', function(done) {
            agent
                .get(url)
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.properties('name', 'email');
                    done();
                });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});