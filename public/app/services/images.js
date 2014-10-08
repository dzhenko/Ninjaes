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
        worldMap: worldMap,
        mapSettings : {
            squareDistance : 60,
            squareCount : 19,
            visibleWidthSquares: 17,
            visibleHeightSquares: 10
        },
        goldImage : goldImage,
        castleImage: castleImage,
        redPlayer: redPlayer,
        blueCastle: blueCastle,
        bluePlayer: bluePlayer
    }
}]);