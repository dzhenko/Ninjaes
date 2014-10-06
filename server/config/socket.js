'use strict';

var handlers = require('../handlers');

module.exports = function (server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });

        socket.on('moved', function(information) {
            socket.emit('moved', handlers.movement.checkMove(information));
        });
    });
};