'use strict';

module.exports = {
    db: 'mongodb://localhost/foundation-dev',
    app: {
        name: 'Foundation Framework'
    },
    facebook: {
        clientID: process.env.facebook_app_id,
        clientSecret: process.env.facebook_app_secret,
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.twitter_api_key,
        clientSecret: process.env.twitter_api_secret,
        callbackURL: 'http://localhost:3000/api/auth/twitter/callback'
    },
    google: {
        clientID: process.env.google_client_id,
        clientSecret: process.env.google_client_secret,
        callbackURL: 'http://localhost:3000/api/auth/google/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/github/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/api/auth/linkedin/callback'
    }
};
