'use strict';

var newUserHandler = require('../handlers/newUserHandler'),
    mapHandler = require('../handlers/mapHandler'),
    movementHandler = require('../handlers/movementHandler');

module.exports = {
    newUser: newUserHandler,
    map: mapHandler,
    movement: movementHandler
};