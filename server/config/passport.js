'use strict';

var passport = require('passport'),
    LocalPassport = require('passport-local'),
    User = require('mongoose').model('User'),
    gameData = require('../data/gameData');

module.exports = function() {
    passport.use(new LocalPassport(function(username, password, done) {
        User.findOne({ username: username }).exec(function(err, user){
            if (err) {
                console.log('Error loading user ' + err);
                return;
            }

            if (user && user.authenticate(password)) {
                return done(null, gameData.players.get(user.coordinates));
            }
            else {
                return done(null, false);
            }
        });
    }));

    passport.serializeUser(function(user, done){
        if (user) {
            return done(null, user._id);
        }
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            if (err) {
                console.log('Error loading user ' + err);
                return;
            }

            if (user) {
                return done(null, gameData.players.get(user.coordinates) ? gameData.players.get(user.coordinates) : user);
            }
            else {
                return done(null, false);
            }
        })
    })
};