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
            email: 'duchess@isis.com',
            username: 'duchess',
            password: 'guest',
            provider: 'local'
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

        it('should require the user to be authenticated to update user object', function(done) {
            agent
                .put('/api/users/user')
                .send({name: 'Foo'})
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

        it('should update a user object', function(done) {
            var new_name = 'Foo';
            var username = 'Bar';

            agent
                .put('/api/users/user')
                .send({
                    name: new_name,
                    username: username
                })
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('name', new_name);
                    res.body.should.have.property('email', user.email);
                    res.body.should.have.property('username', username);
                    done();
                });
        });

    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});