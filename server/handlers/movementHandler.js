'use strict';

var map = require('../handlers/mapHandler');

module.exports = {
    checkMove: function(information) {
        var user = information.user;
        if (!user || user.movement === 0) {
            return false;
        }

        var mapFragment = map.getPieceOfMap(user.coordinates, information.dx, information.dy);

        user.movement--;

        map.movePlayer(user.coordinates, dx, dy);

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
            event = 'gold';
        }
        else if (mapObj.type === 2 || (mapObj.type === 3 && mapObj.object._id !== user._id) || (mapObj.type === 4 && mapObj.object.owner !== user._id)) {
            event = 'enemy';
        }
        else if (mapObj.type === 4 && mapObj.object.owner === user._id) {
            event = 'castle';
        }

        return {
            user: user,
            event: event,
            object: mapObj,
            mapFragment: mapFragment
        };
    }
};