'use strict';

var mongoose = require('mongoose'),
    GameObject = mongoose.model('GameObject'),
    Castle = mongoose.model('Castle'),
    User = mongoose.model('User'),
    gameSettings = require('../config/gameSettings'),
    indexConverter= require('../utilities/indexConverter');

var field;
var players;
var castles;

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

        if (objects.length < (gameSettings.mapSize * gameSettings.mapSize) * 0.2) {
            var goldInterval = setInterval(generateRandomGold, gameSettings.goldSpawnInterval);
            var monsterInterval = setInterval(generateRandomMonster, gameSettings.monsterSpawnInterval);
        }

        objects.forEach(function(obj) {
            field[obj.index] = obj;
        });

        console.log('Map loaded');
    });

    User.find({}, function(err, users) {
        if (err) {
            console.log('Game players could not be loaded ' + err);
            return;
        }

        players = {};

        users.forEach(function(user) {
            players[indexConverter.getIndex(user.coordinates)] = user;
        });

        console.log('Users loaded');
    });

    Castle.find({}, function(err, allCastles) {
        if (err) {
            console.log('Game castles could not be loaded ' + err);
            return;
        }

        castles = {};

        allCastles.forEach(function(castle) {
            castles[indexConverter.getIndex(castle.coordinates)] = castle;
        });

        console.log('Castles loaded');
    });
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
        return;
    }

    var index = indexConverter.getIndex(coordinates);

    if (players[index]) {
        return {
            type: 3,
            amount: 1,
            obj: {
                _id : players[index]._id,
                username : players[index].username,
                experience : players[index].experience
            }
        }
    }
    else if(castles[index]) {
        return {
            type: 4,
            amount: 1,
            obj: {
                owner : castles[index].owner
            }
        }
    }
    else {
        return field[index];
    }
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
        for (var j = 0; j < gameSettings.playerWidthSquares; j++) {
            var obj = getPosition({
                x : topLeft.x + j,
                y : topLeft.y + i
            });

            if (obj) {
                mapFragment.push({
                    x : j,
                    y : i,
                    obj : obj
                })
            }
        }
    }

    return mapFragment;
}

function addPlayer(player) {
    players[indexConverter.getIndex(player.coordinates)] = player;
}

function addCastle(castle) {
    castles[indexConverter.getIndex(castle.coordinates)] = castle;
}

function movePlayer(user, dx, dy) {
    players[indexConverter.getIndex(user.coordinates)] = undefined;

    players[indexConverter.getIndex({
        x: user.coordinates.x + dx,
        y: user.coordinates.y + dy
    })] = user;
}

module.exports = {
    init: initMap,
    update: updateMap,
    getPosition: getPosition,
    setPosition: setPosition,
    removePosition: removePosition,
    getMapFragment: getMapFragment,
    addPlayer: addPlayer,
    addCastle: addCastle,
    movePlayer: movePlayer
};