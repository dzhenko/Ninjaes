'use strict';

var models = require('./models'),
    indexConverter = require('../utilities/indexConverter'),
    gameSettings = require('../config/gameSettings'),
    gameModels = require('../gameModels');

var field = {};
var players = {};
var castles = {};

var changesDictionary = {
    removed: [],
    inserted: []
};

function initMapObjects() {
    models.GameObject.find({}, function (err, objects) {
        if (err) {
            console.log('Game objects could not be loaded ' + err);
            return;
        }

        if (!objects || objects.length === 0) {
            console.log('Map created');
            return;
        }

        require('../handlers/mapHandler').init(objects.length);

        objects.forEach(function (obj) {
            field[obj.index] = obj;
        });

        console.log('Map loaded');
    });
}

function initPlayers() {
    models.User.find({}, function (err, users) {
        if (err) {
            console.log('Game players could not be loaded ' + err);
            return;
        }

        users.forEach(function (user) {
            players[indexConverter.getIndex(user.coordinates)] = user;
        });

        console.log('Users loaded');
    });
}

function initCastles() {
    models.Castle.find({}, function (err, allCastles) {
        if (err) {
            console.log('Game castles could not be loaded ' + err);
            return;
        }

        allCastles.forEach(function (castle) {
            castles[indexConverter.getIndex(castle.coordinates)] = castle;
        });

        console.log('Castles loaded');
    });
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

function updateAllObjects() {
    changesDictionary.removed.slice().forEach(function (item) {
        models.GameObject.findOneAndRemove({index: item.index}, function (err) {
            if (err) {
                console.log('Could not remove item ' + err)
            }
        });
    });

    changesDictionary.inserted.slice().forEach(function (item) {
        models.GameObject.create(item, function (err) {
            if (err) {
                console.log('Could not create item ' + err)
            }
        });
    });

    for (var player in players) {
        if (players[player] && players.hasOwnProperty(player)) {
            models.User.findOneAndUpdate({_id : players[player]._id}, {
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
            models.Castle.findOneAndUpdate({_id : castles[castle]._id}, {
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

function addObject(coordinates, obj) {
    if (!coordinates) {
        return;
    }

    changesDictionary.inserted.push(obj);
    field[indexConverter.getIndex(coordinates)] = obj;
}

function removeObject(coordinates) {
    if (!coordinates) {
        return;
    }

    var index = indexConverter.getIndex(coordinates);
    if (field[index]) {
        changesDictionary.removed.push(JSON.parse(JSON.stringify(field[index])));
        field[index] = undefined;
    }
}

function getObject(coordinates) {
    if (!coordinates) {
        return;
    }

    return field[indexConverter.getIndex(coordinates)];
}

function addPlayer(player) {
    if (!player || !player.coordinates) {
        return;
    }

    players[indexConverter.getIndex(player.coordinates)] = player;
}

function removePlayer(coordinates) {
    players[indexConverter.getIndex(coordinates)] = undefined;
}

function getPlayer(coordinates) {
    if (!coordinates) {
        return;
    }

    return players[indexConverter.getIndex(coordinates)];
}

function setPlayer(coordinates, player) {
    if (!coordinates) {
        return;
    }

    players[indexConverter.getIndex(coordinates)] = player;
}

function getAllPlayers() {
    var allPlayers = [];

    for (var player in players) {
        if (players[player] && players.hasOwnProperty(player)) {
            allPlayers.push(players[player]);
        }
    }

    return allPlayers;
}

function addCastle(castle) {
    if (!castle || !castle.coordinates) {
        return;
    }

    castles[indexConverter.getIndex(castle.coordinates)] = castle;
}

function getCastle(coordinates) {
    if (!coordinates) {
        return;
    }

    return castles[indexConverter.getIndex(coordinates)];
}

function getAny(coordinates) {
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

function init() {
    initMapObjects();
    initPlayers();
    initCastles();

    setInterval(updateAllObjects, gameSettings.objectsSaveInterval);

    setInterval(populateCastles, gameSettings.castleUpdateInterval);
    setInterval(populatePlayers, gameSettings.playerUpdateInterval);
}

module.exports = {
    init: init,
    getAny : getAny,
    objects : {
        remove : removeObject,
        add : addObject,
        get: getObject
    },
    players : {
        add : addPlayer,
        get: getPlayer,
        all : getAllPlayers,
        set : setPlayer,
        remove : removePlayer
    },
    castles: {
        add : addCastle,
        get: getCastle
    }
};