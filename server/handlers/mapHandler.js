'use strict';

var GameObject = require('mongoose').model('GameObject'),
    gameSettings = require('../config/gameSettings'),
    indexConverter= require('../utilities/indexConverter');

var field;

var changesDictionary = {
    removed: [],
    inserted: []
};

function validateCoordinates(coordinates) {
    if (!field) {
        return false;
    }
    return !(coordinates.x < 0 || coordinates.x >=gameSettings.mapSize || coordinates.y < 0 || coordinates.y >=gameSettings.mapSize);
}

function generateRandomGold() {
    if (!field) {
        return;
    }

    var rndPosition = generateRandomPosition();
    while (getPosition(rndPosition) !== undefined) {
        rndPosition = generateRandomPosition();
    }

    setPosition(rndPosition, {
        x : rndPosition.x,
        y : rndPosition.y,
        type: 1,
        amount: (Math.floor(Math.random() * gameSettings.goldMaxStacks)) * gameSettings.goldAmountPerStack,
        object: undefined
    });
}

function generateRandomMonster() {
    if (!field) {
        return;
    }

    var rndPosition = generateRandomPosition();
    while (getPosition(rndPosition) !== undefined) {
        rndPosition = generateRandomPosition();
    }

    setPosition(rndPosition, {
        x : rndPosition.x,
        y : rndPosition.y,
        type: 2,
        amount: (Math.floor(Math.random() * gameSettings.monsterMaxAmount)),
        object: undefined
    });
}

function generateRandomPosition() {
    return {
        x: (Math.floor(Math.random() * gameSettings.mapSize)),
        y: (Math.floor(Math.random() * gameSettings.mapSize))
    }
}

function initMap() {
    setInterval(updateMap, gameSettings.mapSaveInterval);

    GameObject.find({}, function(err, objects) {
        if (err) {
            console.log('Game objects could not be loaded ' + err);
            return;
        }

        field = {};

        if (!objects || objects.length === 0) {
            console.log('Map created');
            return;
        }

        if (objects.length < (gameSettings.mapSize * gameSettings.mapSize) * 0.4) {
            var goldInterval = setInterval(generateRandomGold, gameSettings.goldSpawnInterval);
            var monsterInterval = setInterval(generateRandomMonster, gameSettings.monsterSpawnInterval);
        }

        objects.forEach(function(obj) {
            field[obj.index] = obj;
        });

        console.log('Map loaded');
    })
}

function updateMap() {
    if (!field) return;

    changesDictionary.removed.slice().forEach(function(item) {
        GameObject.findOneAndRemove({index : item.index}, function(err) {
            if (err) {
                console.log('Could not remove item ' + err);
                return;
            }
        });
    });

    changesDictionary.inserted.slice().forEach(function(item) {
        GameObject.create(item, function(err) {
            if (err) {
                console.log('Could not create item ' + err);
                return;
            }
        });
    });

    changesDictionary.removed =[];
    changesDictionary.inserted = [];
}

function movePlayer(coordinates, dx, dy) {
    var currentObj = getPosition(coordinates);
    if (currentObj && currentObj.type === 4) {
        // castle here im on a castle
    }
    else {

    }
}

function getPosition(coordinates) {
    if (!validateCoordinates(coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
        return;
    }

    return field[indexConverter.getIndex(coordinates)];
}

function setPosition(coordinates, obj) {
    if (!validateCoordinates(coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
        return;
    }

    var index = indexConverter.getIndex(coordinates);
    obj.index = index;
    changesDictionary.inserted.push(obj);
    field[index] = obj;
}

function removePosition(coordinates) {
    if (!validateCoordinates(coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
        return;
    }

    var obj = field[indexConverter.getIndex(coordinates)];
    if (obj) {
        changesDictionary.removed.push(obj);
        field[indexConverter.getIndex(coordinates)] = undefined;
    }
}

function getMapFragment(coordinates) {
    if (!field) {
        return;
    }

    var topLeft = {
        x: coordinates.x - gameSettings.playerPositionSquare.x,
        y: coordinates.y - gameSettings.playerPositionSquare.y
    };

    var mapFragment = [];
    for (var i = 0; i < gameSettings.playerHeightSquares; i++) {
        mapFragment.push([]);
        for (var j = 0; j < gameSettings.playerWidthSquares; j++) {
            mapFragment[i].push(getPosition({
                x : topLeft.x + j,
                y : topLeft.y + i
            }))
        }
    }

    return mapFragment;
}

module.exports = {
    init: initMap,
    update: updateMap,
    getPosition: getPosition,
    setPosition: setPosition,
    removePosition: removePosition,
    getMapFragment: getMapFragment,
    movePlayer: movePlayer
};