'use strict';

var handlers = require('../handlers');

var dictByName = {};
var dictById = {};
var dictByNameId = {};

module.exports = {
    config: function (server) {
        var io = require('socket.io')(server);

        io.on('connection', function (socket) {
            socket.on('chat message', function (msg) {
                io.emit('chat message', msg);
            });

            socket.on('moved', function (information) {
                socket.emit('moved', handlers.movement.checkMove(information));
            });

            socket.on('getMap', function (coordinates) {
                socket.emit('getMap', handlers.map.getMapFragment(coordinates));
            });

            socket.on('registerForEvents', function (userData) {
                dictByName[userData.name] = socket;
                dictById[userData.id] = socket;
                dictByNameId[socket.id] = userData;
            });

            socket.on('disconnect', function () {
                if (!dictByNameId[socket.id]) {
                    return;
                }
                dictByName[dictByNameId[socket.id].name] = undefined;
                dictById[dictByNameId[socket.id].id] = undefined;
                dictByNameId[socket.id] = undefined;
            });
        });
    },
    byName : dictByName,
    byId : dictById
};