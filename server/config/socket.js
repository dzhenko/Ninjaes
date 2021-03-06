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

            socket.on('mass message', function(msg) {
                io.emit('mass message', msg);
            });

            socket.on('moved', function (information) {
                socket.emit('moved', handlers.movement.checkMove(information));
            });

            socket.on('get map', function (userForced) {
                socket.emit('get map', handlers.map.getMapFragment(userForced, dictById));
            });

            socket.on('fight monster', function (information) {
                socket.emit('fight monster', handlers.battle.fightMonster(information));
            });

            socket.on('fight hero', function (information) {
                socket.emit('fight hero', handlers.battle.fightHero(information));
            });

            socket.on('buy troops', function(information) {
                socket.emit('buy troops', handlers.troops.buyTroops(information));
            });

            socket.on('register for events', function (userData) {
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