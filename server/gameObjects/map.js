'use strict';

var Map = require('mongoose').model('Map'),
    gameSettings = require('../config/gameSettings');

var field;

setInterval(updateMap, gameSettings.mapSaveInterval);
setInterval(generateRandomGold, gameSettings.goldSpawnInterval);
setInterval(generateRandomMonster, gameSettings.monsterSpawnInterval);

function initMap() {
    Map.findOne({}, function(err, map) {
        if (err) {
            console.log('Map could not be loaded ' + err);
            return;
        }

        if (!map) {
            var matrix = new Array(gameSettings.mapSize);
            for (var i = 0; i < gameSettings.mapSize; i+=1) {
                matrix[i] = [];
            }

            Map.create({
                field: matrix
            }, function(err, mtrx) {
                if (err) {
                    console.log('Map could not be created ' + err);
                    return;
                }

                field = mtrx;
            })
        }
        else {
            field = map;
            console.log('Map loaded');
        }
    })
}

function updateMap() {
    if (!field) return;
    Map.findOne({}, function(err, map) {
        if (err) {
            console.log('Can not update map ' + err);
            return;
        }

        map.field = field;
        map.save();
    })
}

function position() {
    if (!field) {
        console.log('Map is not set');
        return;
    }

    if (arguments[0].x < 0 || arguments[0].x >=gameSettings.mapSize || arguments[0].y < 0 || arguments[0].y >=gameSettings.mapSize) {
        console.log('Out of map range');
        return;
    }

    // getter
    if (arguments.length == 1) {
        if (field[arguments[0].x] === undefined) {
            field[arguments[0].x] = [];
            field[arguments[0].x][arguments[0].y] = 0;
            return 0;
        }
        else {
            return field[arguments[0].x][arguments[0].y];
        }
    }
    // setter
    else if (arguments.length == 2) {
        field[arguments[0].x][arguments[0].y] = arguments[1];
    }
}

function generateRandomGold() {
    var position = generateRandomPosition();
    while (map.position(position) !== 0) {
        position = generateRandomPosition();
    }

    map.position(position, 1);
}

function generateRandomMonster() {
    var position = generateRandomPosition();
    while (map.position(position) !== 0) {
        position = generateRandomPosition();
    }

    map.position(position, 2);
}

function generateRandomPosition() {
    return {
        x: Math.floor(Math.random() * gameSettings.mapSize),
        y: Math.floor(Math.random() * gameSettings.mapSize)
    }
}

module.exports = {
    init: initMap,
    update: updateMap,
    position: position
};