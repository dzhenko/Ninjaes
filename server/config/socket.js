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
                if (dictById[information.user._id] && socket.id === dictById[information.user._id].id) {
                    socket.emit('moved', handlers.movement.checkMove(information));
                }
                else {
                    console.log('Not registered for events user requested move!');
                    console.log(information);
                }
            });

            socket.on('get map', function (userForced) {
                if (dictById[userForced.user._id] && socket.id === dictById[userForced.user._id].id) {
                    socket.emit('get map', handlers.map.getMapFragment(userForced, dictById));
                }
                else {
                    console.log('Not registered for events user requested get map!');
                    console.log(userForced);
                }
            });

            socket.on('fight monster', function (information) {
                if (dictById[information.user._id] && socket.id === dictById[information.user._id].id) {
                    socket.emit('fight monster', handlers.battle.fightMonster(information));
                }
                else {
                    console.log('Not registered for events user requested fight monster!');
                    console.log(information);
                }
            });

            socket.on('fight hero', function (information) {
                if (dictById[information.user._id] && socket.id === dictById[information.user._id].id) {
                    socket.emit('fight hero', handlers.battle.fightHero(information));
                }
                else {
                    console.log('Not registered for events user requested fight hero!');
                    console.log(information);
                }
            });

            socket.on('buy troops', function(information) {
                if (dictById[information.user._id] && socket.id === dictById[information.user._id].id) {
                    socket.emit('buy troops', handlers.troops.buyTroops(information));
                }
                else {
                    console.log('Not registered for events user requested to buy troops!');
                    console.log(information);
                }
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