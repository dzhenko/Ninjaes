var mongoose = require('mongoose'),
    User = mongoose.model('User');

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
    userNameById: function(req, res) {
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
    topScores : function(req, res) {
        User.find({}).sort('experience').limit(10).select('username experience gold').exec(function (err, topUsers) {
            if (err) {
                console.log('Error finding top users ' + err);
                return;
            }

            res.send(topUsers);
        });
    }
};