'use strict';

var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption');

var userSchema = mongoose.Schema({
    username: { type: String, require: '{PATH} is required', unique: true },
    firstName: { type: String, require: '{PATH} is required' },
    lastName: { type: String, require: '{PATH} is required' },
    salt: String,
    hashPass: String,
    roles: [String]
});

userSchema.method({
    authenticate: function (password) {
        return (encryption.generateHashedPassword(this.salt, password) === this.hashPass);
    }
});

var User = mongoose.model('User', userSchema);

module.exports = {
    addAdmins: function () {
        var salt,
            hashedPwd;

        salt = encryption.generateSalt();
        hashedPwd = encryption.generateHashedPassword(salt, 'admin');
        User.create({username: 'admin', firstName: 'Administrator', lastName: 'Pesho', salt: salt, hashPass: hashedPwd, roles: ['admin'], race: 'terran', coordinates: [0,0,0]});

        salt = encryption.generateSalt();
        hashedPwd = encryption.generateHashedPassword(salt, 'password');
        User.create({username: 'administrator', firstName: 'administrator', lastName: 'Gosho', salt: salt, hashPass: hashedPwd, roles: ['admin'], race: 'terran', coordinates: [0,0,1]});

        console.log('Added 2 admins - admin and administrator');
    }
};