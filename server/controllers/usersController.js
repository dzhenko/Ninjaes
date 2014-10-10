'use strict';

var encryption = require('../utilities/encryption'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Castle = mongoose.model('Castle'),
    newUserHandler = require('../handlers/newUserHandler'),
    gameData = require('../data/gameData');

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

                    newUserHandler.updateMapWithUserAndCastle(user, castle);

                    req.logIn(user, function (err) {
                        if (err) {
                            res.status(400);
                            return res.send({reason: err.toString()})
                        }

                        user.hashPass = 'hidden';
                        user.salt = 'hidden';

                        res.send(user);
                    });
                });
            })
        });
    },
    updateUser: function (req, res, next) {
        if (req.user._id && req.body._id && req.user._id.toString() === req.body._id.toString()) {
            //user is updating
            var user = gameData.players.get(req.user.coordinates);

            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;

            if (req.body.password && req.body.password.length > 5) {
                user.salt = encryption.generateSalt();
                user.hashPass = encryption.generateHashedPassword(user.salt, req.body.password);
            }

            gameData.players.set(user.coordinates, user);

            User.findOneAndUpdate({_id : user._id}, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }

                res.send({user : user});
            });
        }
        else if (req.user.roles.indexOf('admin') >= 0) {
            //adming is updating
            var userObj = JSON.parse(req.body.models)[0];
            gameData.players.set(userObj.coordinates, userObj);
            res.send(userObj);
        }
        else {
            req.send({reason: "You do not have permissions"});
        }
    },
    getAllUsers: function (req, res) {
        var all = gameData.players.all();

        if (req.body.sort) {
            var field = req.body.sort[0].field;
            var dir = req.body.sort[0].dir;
            all = all.sort(function(first,second) {
                var a = first[field];
                var b = second[field];
                return dir === 'asc' ? a < b ? 1 : a > b ? -1 : 0 : a < b ? -1 : a > b ? 1 : 0;
            })
        }

        var skip = parseInt(req.body.skip);
        var take = parseInt(req.body.take);

        res.send({
            data : all.slice(skip, skip + take),
            total : all.length
        });
    },
    deleteUser: function(req, res) {
        if (req.user.roles.indexOf('admin') >= 0) {
            var user = JSON.parse(req.body.models)[0];
            gameData.players.remove(user.coordinates);
            User.remove({_id : user._id}, function(err) {
                if (err) {
                    console.log('Error deleting user ' + err);
                }
            })
        }
    }
};