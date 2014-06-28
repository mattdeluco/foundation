'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , bcrypt = require('bcrypt')
    , userRoles = require('../../client/client/auth/AuthAccessLevels')
        .userRoles;


var validatePresenceOf = function (value) {
    return (this.provider && this.provider !== 'local')
        || (value && value.length);
};


var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // TODO Handle providers that don't supply a username
    username: {
        type: String,
        unique: true
        //required: true
    },
    // TODO Handle provider that don't supply an email
    // TODO Handle no emails!
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        bitMask: {
            type: Number,
            default: userRoles.user.bitMask
        },
        title: {
            type: String,
            default: userRoles.user.title
        }
    },
    hashed_password: {
        type: String,
        select: false,
        validate: validatePresenceOf
    },
    provider: {
        type: String,
        default: 'local'
    },
    providers: [{}]
});


UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});


UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return bcrypt.compareSync(plainText, this.hashed_password);
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password) return '';
        return bcrypt.hashSync(password, 10);
    }
};


UserSchema.index({'providers.id': 1})


mongoose.model('User', UserSchema);