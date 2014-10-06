'use strict';

var gameSettings = require('../config/gameSettings');

module.exports = {
    getIndex: function (coordinates) {
        return (coordinates.y * gameSettings.mapSize) + coordinates.x
    },
    getCoordinates: function(index) {
        return {
            x : index % gameSettings.mapSize,
            y : index / gameSettings.mapSize
        }
    }
};