var mongoose = require('mongoose'),
    Message = mongoose.model('Message');

module.exports = {
    getAll : function(req, res, next) {
        Message.find({owner: req.user._id}).exec(function(err, userMessages) {
            if (err) {
                console.log('Game messages could not be loaded ' + err);
                return;
            }

            if (!userMessages) {
                console.log('Un-existing user required his messages');
                res.status(404);
                res.end();
                return;
            }

            res.send({
                messages : userMessages,
                success : true
            });
        });
    },
    create: function(req, res, next) {
        var message = {
            fromID: req.user._id,
            from : req.user.username,
            owner: req.body.targetID,
            text: req.body.textToSend
        };

        console.log(message);

        Message.create(message, function(err, message){
            if (err) {
                console.log('Game message could not be created ' + err);
                return;
            }

            res.send({
                message : message,
                success : true
            });
        });
    },
    remove: function(req, res, next) {
        Message.findOne({_id : req.body.messageId}, function(err, message) {
            if (err) {
                console.log('Game message could not be found ' + err);
                return;
            }

            if (message.owner !== req.user._id) {
                res.send({
                    success : false,
                    reason: 'This is not your message'
                });
            }

            message.remove(function(err) {
                if (err) {
                    console.log('Game message could not be removed ' + err);
                    return;
                }

                res.send({
                    message : message,
                    success : true
                });
            })
        });
    }
};