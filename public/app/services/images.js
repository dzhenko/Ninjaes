app.factory('images', [function() {
    'use strict';

    var goldImage = new Image();
    goldImage.src = './../img/gold.png';
    var castleImage = new Image();
    castleImage.src = './../img/castle_1_red.png';
    var blueCastle = new Image();
    blueCastle.src = './../img/castle_1_blue.png';
    var worldMap = new Image();
    worldMap.src = './../img/world.png';
    var redPlayer = new Image();
    redPlayer.src = './../img/redPlayer.png';
    var bluePlayer = new Image();
    bluePlayer.src = './../img/bluePlayer.png';

    return {
        goldImage : goldImage,
        castleImage: castleImage,
        worldMap: worldMap,
        redPlayer: redPlayer,
        blueCastle: blueCastle,
        bluePlayer: bluePlayer
    }
}]);