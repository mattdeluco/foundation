/**
* Created by mdeluco on 2014-03-29.
*/
'use strict';

var app = require('../../../server')
    , should = require('should')
    , request = require('supertest')
    , User = require('mongoose').model('User')
    , _ = require('lodash')
    , userRoles = require('../../../client/client/auth/AuthAccessLevels').userRoles;


var user;


describe('User Controller', function() {

    before(function(done) {
        user = new User({
            name: 'Sterling Archer',
            email: 'duchess@example.com',
            username: 'duchess',
            password: 'guest'
        });
        user.save();
        done();
    });

    describe('User', function() {

        var agent = request.agent(app);

        it('should require the user to be authenticated to retrieve user object', function(done) {
            agent
                .get('/api/users/user')
                .expect(403, done);
        });

        it('should signin to access the user object', function(done) {
            agent
                .post('/api/auth/signin')
                .send({email: user.email, password: user.password})
                .expect(200, done);
        });

        it('should have access to the user object after signin', function(done) {
            agent
                .get('/api/users/user')
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

    });

    describe('Edit User Profile', function () {

        var agent = request.agent(app);

        it('should require the user to be authenticated to edit the user profile', function(done) {
            agent
                .put('/api/users/user')
                .send({name: 'Foo'})
                .expect(403, done);
        });

        it('must signin to edit the user profile', function (done) {
            agent
                .post('/api/auth/signin')
                .send({email: user.email, password: user.password})
                .expect(200, done);
        });

        it('should update the user profile', function(done) {
            var new_name = 'Foo';
            var username = 'Bar';

            agent
                .put('/api/users/user')
                .send({
                    name: new_name,
                    username: username
                })
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.have.property('name', new_name);
                    res.body.should.have.property('email', user.email);
                    res.body.should.have.property('username', username);
                    done();
                });
        });

        it('should not update the user password without the old password', function (done) {
            done();
        });

        it('should update the user password', function (done) {

            var old_password = user.password;
            var new_password = user.password = 'guest123';

            agent
                .put('/api/users/user')
                .send({
                    email: user.email,
                    password: old_password,
                    new_password: user.password
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.not.have.property('hashed_password');
                    done();
                });
        });

        it('should sign out', function (done) {
            agent
                .get('/api/auth/signout')
                .expect(302, done);
        });

        it('should sign in using the new password', function (done) {
            agent
                .post('/api/auth/signin')
                .send({email: user.email, password: user.password})
                .expect(200, done);
        });

    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});