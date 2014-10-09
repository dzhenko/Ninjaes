'use strict';

var mongoose = require('mongoose'),
    GameObject = mongoose.model('GameObject'),
    Castle = mongoose.model('Castle'),
    User = mongoose.model('User'),
    gameSettings = require('../config/gameSettings'),
    indexConverter = require('../utilities/indexConverter'),
    gameModels = require('../gameModels');

var field;
var players;
var castles;

var changesDictionary = {
    removed: [],
    inserted: []
};

function validateCoordinates(coordinates) {
    if (!field || !coordinates) {
        return false;
    }
    return !(coordinates.x < 0 || coordinates.x >= gameSettings.mapSize || coordinates.y < 0 || coordinates.y >= gameSettings.mapSize);
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

function populateCastles() {
    var moneyPerPlayer = {};
    for (var castle in castles) {
        if (castles[castle] && castles.hasOwnProperty(castle)) {
            for (var i = 0; i < castle.troopsForSale.length; i++) {
                castles[castle].troopsForSale[i] += gameModels.buildings.castle.produces[castles[castle].buildings.castle] *
                    castles[castle].buildings.troops[i] * gameModels.troops[i].growth;
            }

            moneyPerPlayer[castles[castle].owner] = gameModels.buildings.hall.produces[castles[castle].buildings.hall]
        }
    }

    for (var player in players) {
        if (players[player] && players.hasOwnProperty(player)) {
            players[player].gold += moneyPerPlayer[player._id];
        }
    }
}

function populatePlayers() {
    for (var player in players) {
        if (players[player] && players.hasOwnProperty(player)) {
            players[player].movement += gameSettings.playerUpdateMovement;
        }
    }
}

function initMap() {
    setInterval(updateMap, gameSettings.mapSaveInterval);

    setInterval(populateCastles, gameSettings.castleUpdateInterval);
    setInterval(populatePlayers, gameSettings.playerUpdateInterval);

    GameObject.find({}, function (err, objects) {
        if (err) {
            console.log('Game objects could not be loaded ' + err);
            return;
        }

        field = {};

        if (objects.length < (gameSettings.mapSize * gameSettings.mapSize) * 0.1) {
            console.log('Items generating enabled - currently ' + objects.length + ' out of ' + (gameSettings.mapSize * gameSettings.mapSize * 0.1));
            var goldInterval = setInterval(generateRandomGold, gameSettings.goldSpawnInterval);
            var monsterInterval = setInterval(generateRandomMonster, gameSettings.monsterSpawnInterval);
        }
        else {
            console.log('Items generating DISABLED');
        }

        if (!objects || objects.length === 0) {
            console.log('Map created');
            return;
        }

        objects.forEach(function (obj) {
            field[obj.index] = obj;
        });

        console.log('Map loaded');
    });

    User.find({}, function (err, users) {
        if (err) {
            console.log('Game players could not be loaded ' + err);
            return;
        }

        players = {};

        users.forEach(function (user) {
            players[indexConverter.getIndex(user.coordinates)] = user;
        });

        console.log('Users loaded');
    });

    Castle.find({}, function (err, allCastles) {
        if (err) {
            console.log('Game castles could not be loaded ' + err);
            return;
        }

        castles = {};

        allCastles.forEach(function (castle) {
            castles[indexConverter.getIndex(castle.coordinates)] = castle;
        });

        console.log('Castles loaded');
    });
}

function updateMap() {
    if (!field) return;

    changesDictionary.removed.slice().forEach(function (item) {
        GameObject.findOneAndRemove({index: item.index}, function (err) {
            if (err) {
                console.log('Could not remove item ' + err)
            }
        });
    });

    changesDictionary.inserted.slice().forEach(function (item) {
        GameObject.create(item, function (err) {
            if (err) {
                console.log('Could not create item ' + err)
            }
        });
    });

    for (var player in players) {
        if (players[player] && players.hasOwnProperty(player)) {
            User.findOneAndUpdate({_id : players[player]._id}, {
                coordinates : players[player].coordinates,
                gold : players[player].gold,
                troops : players[player].troops,
                experience : players[player].experience,
                movement: players[player].movement
            }, function(err, newOne) {
                if (err) {
                    console.log('Could not update user : ' + err);
                }
            })
        }
    }

    for (var castle in castles) {
        if (castles[castle] && castles.hasOwnProperty(castle)) {
            Castle.findOneAndUpdate({_id : castles[castle]._id}, {
                buildings : castles[castle].buildings,
                troopsForSale: castles[castle].troopsForSale
            }, function(err, newOne) {
                if (err) {
                    console.log('Could not update castle : ' + err);
                }
            })
        }
    }

    changesDictionary.removed = [];
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
                _id: players[index]._id,
                username: players[index].username,
                experience: players[index].experience,
                coordinates: {
                    x : players[index].coordinates.x,
                    y : players[index].coordinates.y
                }
            }
        }
    }
    else if (castles[index]) {
        return {
            type: 4,
            amount: 1,
            obj: {
                owner: castles[index].owner,
                coordinates: {
                    x : castles[index].coordinates.x,
                    y : castles[index].coordinates.y
                }
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

function getMapFragment(userForced, dictById) {
    if (!validateCoordinates(userForced.user.coordinates)) {
        console.log(!field ? 'Map is not set' : 'Invalid coordinates');
        return;
    }

    var topLeft = {
        x: userForced.user.coordinates.x - gameSettings.playerPositionSquare.x,
        y: userForced.user.coordinates.y - gameSettings.playerPositionSquare.y
    };

    var mapFragment = [];
    for (var i = 0; i < gameSettings.playerHeightSquares; i++) {
        for (var j = 0; j < gameSettings.playerWidthSquares; j++) {
            var obj = getPosition({
                x: topLeft.x + j,
                y: topLeft.y + i
            });

            if (obj && !(j === 8 && i === 5 && obj.type === 3)) {
                if (obj.type === 3 && dictById[obj._id] && !userForced.forced) {
                    dictById[obj._id].emit('someone moved');
                }

                mapFragment.push({
                    x: j,
                    y: i,
                    obj: obj
                })
            }
        }
    }

    return mapFragment;
}

function addPlayer(player) {
    if (!players) {
        return;
    }

    players[indexConverter.getIndex(player.coordinates)] = player;
}

function addCastle(castle) {
    if (!castles) {
        return;
    }

    castles[indexConverter.getIndex(castle.coordinates)] = castle;
}

function movePlayer(user, dx, dy) {
    if (!players) {
        return;
    }

    players[indexConverter.getIndex(user.coordinates)] = undefined;

    players[indexConverter.getIndex({
        x: user.coordinates.x + dx,
        y: user.coordinates.y + dy
    })] = user;
}

function getUser(coords) {
    if (!players) {
        return;
    }

    return players[indexConverter.getIndex(coords)];
}

function getAllUsers() {
    if (!players) {
        return;
    }

    var allPlayers = [];

    for (var player in players) {
        if (players[player] && players.hasOwnProperty(player)) {
            allPlayers.push(players[player]);
        }
    }

    return allPlayers;
}

function getCastle(coords) {
    if (!castles) {
        return;
    }

    return castles[indexConverter.getIndex(coords)];
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
    movePlayer: movePlayer,
    getUser : getUser,
    getCastle : getCastle,
    getAllUsers: getAllUsers
};