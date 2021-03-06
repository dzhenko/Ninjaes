'use strict';

var gameSettings = require('../config/gameSettings'),
    originalGameData = require('../data/gameData');

module.exports = {
    getUnusedCoordinates: function (otherCastles) {
        var invalidCoords = true;

        while (invalidCoords) {
            invalidCoords = false;
            var randomX = Math.floor(Math.random() * gameSettings.mapSize / gameSettings.playerTerrainSize) * gameSettings.playerTerrainSize + gameSettings.playerTerrainSize / 2;
            var randomY = Math.floor(Math.random() * gameSettings.mapSize / gameSettings.playerTerrainSize) * gameSettings.playerTerrainSize + gameSettings.playerTerrainSize / 2;

            for (var i = 0; i < otherCastles.length; i++) {
                if (otherCastles[i].coordinates.x === randomX && otherCastles[i].coordinates.y === randomY) {
                    randomX = Math.floor(Math.random() * gameSettings.mapSize / gameSettings.playerTerrainSize) * gameSettings.playerTerrainSize + gameSettings.playerTerrainSize / 2;
                    randomY = Math.floor(Math.random() * gameSettings.mapSize / gameSettings.playerTerrainSize) * gameSettings.playerTerrainSize + gameSettings.playerTerrainSize / 2;

                    invalidCoords = true;
                    break;
                }
            }
        }

        return {
            x : randomX,
            // the user is in the bottom center of the castle
            y : randomY + 1
        };
    },
    getUserObjects: function(user) {
        user.gold = 10000;
        user.troops = [25,8,3,0,0,0,0];
        user.experience = 0;
        user.movement = 500;
    },
    getUserCastle: function(user) {
        return {
            owner: user._id,
            coordinates: {
                x: user.coordinates.x,
                // the castle needs to be centered
                y: user.coordinates.y - 1
            },
            buildings: {
                hall: 0,
                castle: 0,
                troops: [1,0,0,0,0,0,0]
            },
            troopsForSale: [0,0,0,0,0,0,0],
            troops: [0,0,0,0,0,0,0]
        }
    },
    //TODO: Test
    updateMapWithUserAndCastle: function(user, castle, gameData) {
        gameData = gameData || originalGameData;

        gameData.players.add(user);
        gameData.castles.add(castle);
    }
};