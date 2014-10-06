'use strict';

var GameObject = require('mongoose').model('GameObject'),
    gameSettings = require('../config/gameSettings'),
    indexConverter= require('../utilities/indexConverter');

var field;

setInterval(updateMap, gameSettings.mapSaveInterval);
setInterval(generateRandomGold, gameSettings.goldSpawnInterval);
setInterval(generateRandomMonster, gameSettings.monsterSpawnInterval);

var changesDictionary = {
    removed: [],
    inserted: []
};

function initMap() {
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

function getPosition(coordinates) {
    if (!validateCoordinates(coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
    }

    return field[indexConverter.getIndex(coordinates)];
}

function setPosition(coordinates, obj) {
    if (!validateCoordinates(coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
    }

    var index = indexConverter.getIndex(coordinates);
    obj.index = index;
    changesDictionary.inserted.push(obj);
    field[index] = obj;
}

function removePosition(coordinates) {
    if (!validateCoordinates(coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
    }

    var obj = field[indexConverter.getIndex(coordinates)];
    if (obj) {
        changesDictionary.removed.push(obj);
        field[indexConverter.getIndex(coordinates)] = undefined;
    }
}

function validateCoordinates(coordinates) {
    return !(!field || arguments[0].x < 0 || arguments[0].x >=gameSettings.mapSize || arguments[0].y < 0 || arguments[0].y >=gameSettings.mapSize)
}

function generateRandomGold() {
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

module.exports = {
    init: initMap,
    update: updateMap,
    getPosition: getPosition,
    setPosition: setPosition,
    removePosition: removePosition
};