var mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    socket = require('../config/socket');

module.exports = {
    getAllMessages : function(req, res, next) {
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
    createMessage: function(req, res, next) {
        var message = {
            fromID: req.user._id,
            from : req.user.username,
            owner: req.body.targetID,
            text: req.body.textToSend
        };

        Message.create(message, function(err, message){
            if (err) {
                console.log('Game message could not be created ' + err);
                return;
            }

            if (socket.byId[message.owner]) {
                socket.byId[message.owner].emit('new message', message.from);
            }

            res.send({
                message : message,
                success : true
            });
        });
    },
    removeMessage: function(req, res, next) {
        Message.findById(req.body.messageId, function(err, message) {
            if (err) {
                console.log('Game message could not be found ' + err);
                return;
            }

            if (message === null || message.owner.toString() !== req.user._id.toString()) {
                res.send({
                    success : false,
                    reason: 'This is not your message'
                });

                return;
            }

            message.remove(function(err) {
                if (err) {
                    console.log('Game message could not be removed ' + err);
                    return;
                }

                res.send({
                    success : true
                });
            })
        });
    }
};