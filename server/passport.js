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
    config = require('./config'),
    _ = require('lodash');


var providers = {
    facebook: {
        strategy: FacebookStrategy,
        scope: ['public_profile', 'email'],
        mapProfile: function (profile) {
            var facebookProfile = {
                name: profile.displayName
                // TODO photo
            };

            if (profile.emails) {
                facebookProfile['email'] = profile.emails[0].value;
            }
            return facebookProfile;
        }
    },
    google: {
        strategy: GoogleStrategy,
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        mapProfile: function (profile) {
            var googleProfile = {
                name: profile.displayName,
                email: profile.emails[0].value
            };

            if (profile.username) {
                googleProfile.username = profile.username;
            }

            return googleProfile;
        }
    },
    twitter: {
        strategy: TwitterStrategy,
        options: {
            consumerKey: config['twitter'].clientID,
            consumerSecret: config['twitter'].clientSecret
        },
        mapProfile: function (profile) {
            return {
                username: profile.username,
                name: profile.displayName
                //TODO photo
            };
        }
    }
    /*
    linkedin: {
        strategy: LinkedinStrategy,
        mapProfile: function (profile) {
            return {
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value
            };
        }
    },
    github: {
        strategy: GitHubStrategy,
        mapProfile: function (profile) {
            return {
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username
            };
        }
    }
    */
};


var registerOrLink = function (req, profile, done) {

    if (!req.user) {

        // Not logged in
        //  If provider exists log user in
        //  else create new account

        User.findOne({
            'providers.provider': profile.provider,
            'providers.id': profile.id
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {

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

            } else {
                return done(null, user);
            }
        });

    } else {

        // Logged in, add provider to account

        // TODO ensure uniqueness among providers!
        // Does this work??
        // Support multiple accounts with same provider?  Check profile.id...
        if (req.user.providers[profile.provider]) {
            return done(null, user);
        }

        req.user.providers.push(profile);
        req.user.save(function (err, user) {
            if (err) console.log(err);
            return done(null, user);
        });

    }

};


_.forEach(providers, function (provider, name) {
    var options = _.extend({
        clientID: config[name].clientID,
        clientSecret: config[name].clientSecret,
        callbackURL: config[name].callbackURL,
        passReqToCallback: true
    }, provider.options);

    passport.use(new provider.strategy(options,
        function (req, accessToken, refreshToken, profile, done) {
            var newProfile = provider.mapProfile(profile);
            newProfile.id = profile.id;
            newProfile.provider = profile.provider;
            newProfile.token = accessToken;
            registerOrLink(req, newProfile, done);
    }));
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
                    msg: 'Invalid email or password'
                });
            }

            user.hashed_password = undefined;
            return done(null, user);
        });
    }
));


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


exports.providers = providers;
