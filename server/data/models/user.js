'use strict';

var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

var userSchema = mongoose.Schema({
    username: { type: String, require: '{PATH} is required', unique: true },
    firstName: { type: String, require: '{PATH} is required' },
    lastName: { type: String, require: '{PATH} is required' },
    salt: String,
    hashPass: String,
    roles: [String],
    coordinates: {
        x : Number,
        y: Number
    },
    gold : Number,
    movement: Number,
    experience: Number,
    troops: [Number]
});

userSchema.method({
    authenticate: function (password) {
        return (encryption.generateHashedPassword(this.salt, password) === this.hashPass);
    }
});

module.exports = mongoose.model('User', userSchema);