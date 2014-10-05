'use strict';

var encryption = require('../utilities/encryption'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Castle = mongoose.model('Castle'),
    newUserHandler = require('../handlers/newUserHandler');

module.exports = {
    createUser: function (req, res, next) {
        var newUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username
        };

        newUserData.salt = encryption.generateSalt();
        newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, req.body.password);
        newUserData.roles = ['user'];

        Castle.find({}).select('coordinates').exec(function(err, allCastles) {
            if (err) {
                console.log('Failed to find all users to get their coordinates' + err);
                return;
            }

            newUserData.coordinates = newUserHandler.getUnusedCoordinates(allCastles);

            newUserHandler.getUserObjects(newUserData);

            User.create(newUserData, function (err, user) {
                if (err) {
                    console.log('Failed to register new user ' + err);
                    res.status(400);
                    res.send(false);
                    return;
                }

                Castle.create(newUserHandler.getUserCastle(user), function(err, castle) {
                    if (err) {
                        console.log('Failed to create castle for new user ' + err);
                        res.status(400);
                        res.send(false);
                        return;
                    }

                    newUserHandler.updateMapWithUser(user);

                    req.logIn(user, function (err) {
                        if (err) {
                            res.status(400);
                            return res.send({reason: err.toString()})
                        }

                        res.send(user);
                    });
                });
            })
        });
    },
    updateUser: function (req, res, next) {
        if (req.user._id.toString() === req.body._id.toString() || req.user.roles.indexOf('admin') >= 0) {
            // changed properties
            var newUserData = {
                firstName : req.body.firstName,
                lastName: req.body.lastName
            };
            if (req.body.password && req.body.password.length > 5) {
                newUserData.salt = encryption.generateSalt();
                newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, req.body.password);
            }

            User.update({_id: newUserData._id}, newUserData, function () {
                res.end();
            });
        }
        else {
            req.send({reason: "You do not have permissions"});
        }
    },
    getAllUsers: function (req, res) {
        User.find({}).select('username _id').exec(function (err, collection) {
            if (err) {
                console.log('Users could not be loaded ' + err);
            }

            res.send(collection);
        });
    }
};