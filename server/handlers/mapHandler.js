'use strict';

var gameSettings = require('../config/gameSettings'),
    originalGameData = require('../data/gameData');

function validateCoordinates(coordinates) {
    if (!coordinates) {
        return false;
    }
    return !(coordinates.x < 0 || coordinates.x >= gameSettings.mapSize ||
        coordinates.y < 0 || coordinates.y >= gameSettings.mapSize);
}

function generateRandomPosition() {
    return {
        x: (Math.floor(Math.random() * gameSettings.mapSize)),
        y: (Math.floor(Math.random() * gameSettings.mapSize))
    }
}

//TODO: Test
function generateRandomGold(gameData) {
    gameData = gameData || originalGameData;

    var rndPosition = generateRandomPosition();
    while (gameData.getAny(rndPosition) !== undefined) {
        rndPosition = generateRandomPosition();
    }

    gameData.objects.add(rndPosition, {
        type: 1,
        amount: (Math.floor(Math.random() * gameSettings.goldMaxStacks)) * gameSettings.goldAmountPerStack,
        object: undefined
    });
}

//TODO: Test
function generateRandomMonster(gameData) {
    gameData = gameData || originalGameData;

    var rndPosition = generateRandomPosition();
    while (gameData.getAny(rndPosition) !== undefined) {
        rndPosition = generateRandomPosition();
    }

    gameData.objects.add(rndPosition, {
        type: 2,
        amount: (Math.floor(Math.random() * gameSettings.monsterMaxAmount)),
        object: undefined
    });
}

//TODO: Test
function getMapFragment(userForced, dictById, gameData) {
    gameData = gameData || originalGameData;

    if (!validateCoordinates(userForced.user.coordinates)) {
        console.log('Invalid coordinates');
        return;
    }

    var topLeft = {
        x: userForced.user.coordinates.x - gameSettings.playerPositionSquare.x,
        y: userForced.user.coordinates.y - gameSettings.playerPositionSquare.y
    };

    var mapFragment = [];
    for (var i = 0; i < gameSettings.playerHeightSquares; i++) {
        for (var j = 0; j < gameSettings.playerWidthSquares; j++) {
            var obj = gameData.getAny({
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

function init(numberOfGameObjects) {
    if (numberOfGameObjects < (gameSettings.mapSize * gameSettings.mapSize) * 0.1) {
        console.log('Items generating enabled - currently ' + numberOfGameObjects + ' out of ' + (gameSettings.mapSize * gameSettings.mapSize * 0.1));
        setInterval(generateRandomGold, gameSettings.goldSpawnInterval);
        setInterval(generateRandomMonster, gameSettings.monsterSpawnInterval);
    }
    else {
        console.log('Items generating DISABLED');
    }
}

module.exports = {
    init: init,
    getMapFragment: getMapFragment,
    validateCoordinates: validateCoordinates,
    generateRandomGold: generateRandomGold,
    generateRandomMonster: generateRandomMonster
};