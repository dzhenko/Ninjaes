'use strict';

var map = require('../handlers/mapHandler');

module.exports = {
    checkMove: function(information, dictById) {
        var user = map.getUser(information.user.coordinates);

        if (!user || user.movement === 0) {
            return false;
        }

        var futureCoords = {
            x : user.coordinates.x + information.dx,
            y : user.coordinates.y + information.dy
        };

        var mapObj = map.getPosition(futureCoords);

        user.movement--;

        var event;
        if (!mapObj) {
            event = 'null';

            map.movePlayer(user, information.dx, information.dy);
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

                map.removePosition(futureCoords);
            }
            else if (mapObj.type === 4 && mapObj.obj && mapObj.obj.owner.toString() === user._id.toString()) {
                event = 'castle';
                var userCastle = map.getCastle(mapObj.obj.coordinates);

                if (!userCastle) {
                    console.log('Serious bug map handler 48 row - can not get castle at coords');
                    return;
                }

                for (var i = 0; i < userCastle.troops.length; i++) {
                    user.troops[i] += userCastle.troops[i];
                    userCastle.troops[i] = 0;
                }
            }
            else {
                console.log('movement handler logic error : ' + mapObj);
            }

            map.movePlayer(user, information.dx, information.dy);
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