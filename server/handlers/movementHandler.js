'use strict';

var map = require('../handlers/mapHandler');

module.exports = {
    checkMove: function(information, dictById) {
        var user = map.getUser(information.user.coordinates);

        if (!user || user.movement === 0) {
            return false;
        }

        user.movement--;

        map.movePlayer(user, information.dx, information.dy);

        user.coordinates = {
            x : user.coordinates.x + information.dx,
            y : user.coordinates.y + information.dy
        };

        var mapObj = map.getPosition(user.coordinates);

        var event;

        if (!mapObj) {
            event = 'null';
        }
        else if (mapObj.type === 1) {
            user.gold += mapObj.amount;
            map.removePosition(user.coordinates);
            event = 'gold';
        }
        else if (mapObj.type === 2 ||
                (mapObj.type === 3 && mapObj.obj && mapObj.obj._id !== user._id) ||
                (mapObj.type === 4 && mapObj.obj && mapObj.obj.owner !== user._id)) {

            event = 'enemy';

            // rollback move
            map.movePlayer(user, -information.dx, -information.dy);
            user.coordinates = {
                x : user.coordinates.x - information.dx,
                y : user.coordinates.y - information.dy
            };
        }
        else if (mapObj.type === 4 && mapObj.obj && mapObj.obj.owner === user._id) {
            event = 'castle';
        }

        return {
            user: user,
            event: event,
            object: mapObj,
            mapFragment: map.getMapFragment({
                user : user,
                forced : false
            }, dictById),
            move: event !== 'enemy'
        };
    }
};