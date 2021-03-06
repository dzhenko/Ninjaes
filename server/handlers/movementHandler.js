'use strict';

var originalGameData = require('../data/gameData'),
    map = require('../handlers/mapHandler');

//TODO: Test
function movePlayer(player, dx, dy, gameData) {
    if (!player.coordinates) {
        return;
    }

    gameData.players.remove(player.coordinates);

    gameData.players.set({
        x: player.coordinates.x + dx,
        y: player.coordinates.y + dy
    }, player);
}

module.exports = {
    //TODO: Test
    checkMove: function(information, dictById, gameData) {
        gameData = gameData || originalGameData;

        if (!information.user) {
            return;
        }

        var user = gameData.players.get(information.user.coordinates);

        if (!user || user.movement === 0) {
            return false;
        }

        var futureCoords = {
            x : user.coordinates.x + information.dx,
            y : user.coordinates.y + information.dy
        };

        var mapObj = gameData.objects.get(futureCoords);

        user.movement--;

        var event;
        if (!mapObj) {
            event = 'null';

            movePlayer(user, information.dx, information.dy, gameData);
            user.coordinates = futureCoords;
        }
        else if (mapObj.type === 2 ||
            (mapObj.type === 3 && mapObj.obj && mapObj.obj._id.toString() !== user._id.toString()) ||
            (mapObj.type === 4 && mapObj.obj && mapObj.obj.owner.toString() !== user._id.toString())) {

            event = 'enemy';
        }
        else {
            if (!mapObj) {
                event = 'null';
            }
            else if (mapObj.type === 1) {
                user.gold += mapObj.amount;
                event = 'gold';

                gameData.objects.remove(futureCoords);
            }
            else if (mapObj.type === 4 && mapObj.obj && mapObj.obj.owner.toString() === user._id.toString()) {
                event = 'castle';
                var userCastle = gameData.castles.get(mapObj.obj.coordinates);

                if (!userCastle) {
                    console.log('Serious bug map handler 48 row - can not get castle at coords');
                    return;
                }

                for (var i = 0; i < userCastle.troops.length; i++) {
                    user.troops[i] += userCastle.troops[i];
                    userCastle.troops[i] = 0;
                }
            }

            movePlayer(user, information.dx, information.dy, gameData);
            user.coordinates = futureCoords;
        }

        return {
            user: user,
            event: event,
            object: mapObj,
            mapFragment: map.getMapFragment({
                user : user,
                forced : false
            }, dictById)
        };
    }
};