'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LinkedinStrategy = require('passport-linkedin').Strategy,
    User = mongoose.model('User'),
    config = require('./config');


var createOrUpdate = function (req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    // Not logged in
    //  If provider exists log user in
    //  else create new account
    if (!req.user) {

        User.findOne({
            'providers.provider': profile.provider,
            'providers.id': profile.id
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                profile.token = accessToken;

                var newUser = new User({
                    name: profile.name,
                    provider: profile.provider,
                    providers: [profile]
                });

                if (profile.email) {
                    newUser.email = profile.email;
                }

                if (profile.username) {
                    newUser.username = profile.username;
                }

                newUser.save(function (err) {
                    if (err) console.log(err);
                    return done(null, newUser);
                });
            }

            return done(null, user);
        });

    } else { // Logged in, add provider to account

        profile.token = accessToken;

        User.findByIdAndUpdate(req.user._id,
            {$push: {providers: profile}});

        return done(null, req.user);

    }

};


module.exports = function() {

    // Serialize the user id to push into the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user object based on a pre-serialized token
    // which is the user id
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({email: email}, '+hashed_password', function(err, user) {
                if (err) return done(err);

                if (!user || !user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid email or password'
                    });
                }

                user.hashed_password = undefined;
                return done(null, user);
            });
        }
    ));

    // Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            var facebookProfile = {
                id: profile.id,
                name: profile.displayName,
                token: accessToken,
                provider: profile.provider
                // TODO picture
            };

            if (profile.emails) {
                facebookProfile['email'] = profile.emails[0].value;
            }

            createOrUpdate(req, accessToken, refreshToken, facebookProfile, done);

        }
    ));

    // Use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL,
            passReqToCallback: true
        },
        function(req, token, tokenSecret, profile, done) {

            User.findOne({
                'twitter.id_str': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        provider: 'twitter',
                        twitter: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    // Use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'google',
                        google: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    // use linkedin strategy
    passport.use(new LinkedinStrategy({
            consumerKey: config.linkedin.clientID,
            consumerSecret: config.linkedin.clientSecret,
            callbackURL: config.linkedin.callbackURL,
            profileFields: ['id', 'first-name', 'last-name', 'email-address'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
          User.findOne({
                'linkedin.id': profile.id
            }, function (err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.emails[0].value,
                        provider: 'linkedin'
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user)
                }
            });
        }
    ));

    // Use github strategy
    passport.use(new GitHubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            User.findOne({
                'github.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'github',
                        github: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));
};