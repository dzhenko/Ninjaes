var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Castle = mongoose.model('Castle');

module.exports = {
    userIdByName: function (req, res) {
        User.findOne({username: req.params.name}).select('_id').exec(function (err, userId) {
            if (err) {
                console.log('Error finding username ' + err);
                return;
            }

            if (userId !== null) {
                res.send({
                    id: userId.id,
                    success: true
                });
            }
            else {
                res.send({
                    success: false
                });
            }
        });
    },
    userNameById: function (req, res) {
        User.findById(req.params.id).select('username').exec(function (err, username) {
            if (err) {
                console.log('Error finding user id ' + err);
                return;
            }

            if (username !== null) {
                res.send({
                    username: username.username,
                    success: true
                });
            }
            else {
                res.send({
                    success: false
                });
            }
        });
    },
    userCastle: function(req, res) {
        Castle.findOne({owner : req.user._id.toString()}, function(err, castle) {
            if (err) {
                console.log('Could not find castle' + err);
                return;
            }

            res.send({
                success: true,
                castle: castle
            })
        })
    },
    topScores: function (req, res) {
        User.find({}).sort('experience').limit(10).select('username experience gold').exec(function (err, topUsers) {
            if (err) {
                console.log('Error finding top users ' + err);
                return;
            }

            res.send({
                success: true,
                topUsers: topUsers
            });
        });
    },
    gameStatistics: function (req, res) {
        User.count({}, function (err, usersCount) {
            if (err) {
                console.log('Error generation users count ' + err);
                return;
            }

            res.send({
                success: true,
                stats: {
                    usersCount: usersCount,
                    serverUptime: 1200000
                }
            });
        });
    },
    userOverview: function(req, res) {
        User.findById(req.user._id.toString(), function(err, user) {
            if (err) {
                console.log('Could not find user' + err);
                return;
            }

            user.salt = 'hidden';
            user.hashPass = 'hidden';

            Castle.find({owner : req.user._id.toString()}, function(err, castle) {
                if (err) {
                    console.log('Could not find castle' + err);
                    return;
                }

                res.send({
                    success: true,
                    user: user,
                    castle: castle
                })
            })
        })
    }
};