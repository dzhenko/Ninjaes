'use strict';

var map = require('../handlers/mapHandler');

module.exports = {
    checkMove: function(information) {
        var user = information.user;
        if (!user || user.movement === 0) {
            return false;
        }

        user.movement--;

        map.removePosition(user.coordinates);

        //TODO: clear logging
        console.log('Before move : ' + user.coordinates.x + ' ' + user.coordinates.y);

        user.coordinates = {
            x : user.coordinates.x + information.dx,
            y : user.coordinates.y + information.dy
        };

        //TODO: clear logging
        console.log('After move : ' + user.coordinates.x + ' ' + user.coordinates.y);

        var mapObj = map.getPosition(user.coordinates);
        var event;

        if (!mapObj) {
            event = 'null';
        }
        else if (mapObj.type === 1) {
            user.gold += mapObj.amount;
            event = 'gold';
        }
        else if (mapObj.type === 2 || mapObj.type === 3 || (mapObj.type === 4 && mapObj.object.owner !== user._id)) {
            event = 'enemy';
        }
        else if (mapObj.type === 4 && mapObj.object.owner === user._id) {
            event = 'castle';
        }

        //TODO: clear logging
        console.log('Returned object :');
        console.dir({
            user: user,
            event: event,
            object: mapObj
        });

        return {
            user: user,
            event: event,
            object: mapObj
        };
    }
};