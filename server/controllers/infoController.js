var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
    userIdByName: function (req, res) {
        User.findOne({username: req.params.name}).select('_id').exec(function (err, userId) {
            if (err) {
                console.log('Error finding username ' + err);
                return;
            }

            if (userId) {
                res.send({
                    id: userId,
                    success: true
                });
            }
            else {
                res.send({
                    success: false,
                    reason : 'User not found'
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