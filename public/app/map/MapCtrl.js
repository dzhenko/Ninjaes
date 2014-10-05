'use strict';

app.controller('MapCtrl', ['$scope', '$location', 'mapData', 'mapPreloader', function ($scope, $location, mapData, mapPreloader) {
    $scope.params = {};
    $scope.playerPosition = {
        x: 0,
        y: 0
    };
    $scope.castlePosition = {
        x: 0,
        y: 0
    };
    $scope.mapPosition = {
        x: 0,
        y: 0
    };
    $scope.images = {};
    var gameObjects = [
        {name: 'castle', src: '../../img/castle-building.gif'},
        {name: 'bluePlayer', src: '../../img/bluePlayer.png'},
        {name: 'map', src: './../img/world.png'}
    ];
    var distance = 60;

    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    mapPreloader.preloadImages(gameObjects)
        .then(function (images) {
            $scope.images = images;
            $scope.playerPosition.x = canvas.width / 2;
            $scope.playerPosition.y = canvas.height / 2;
            $scope.redraw();
        });

    var keyboardHandler = function (e) {
        // Arrow key press navigates through the page by default
        // so this default should be prevented to move only on the map
        // using arrow keys
        e.preventDefault();

        if (e.keyCode === 37) {
            // console.log('lef arrow');
            $scope.mapPosition.x += distance;
            $scope.redraw();
        }
        if (e.keyCode === 38) {
            // console.log('up arrow');
            $scope.mapPosition.y += distance;
            $scope.redraw();
        }
        if (e.keyCode === 39) {
            // console.log('right arrow');
            $scope.mapPosition.x -= distance;
            $scope.redraw();
        }
        if (e.keyCode === 40) {
            // console.log('down arrow');
            $scope.mapPosition.y -= distance;
            $scope.redraw();
        }
    };

    $scope.movePlayer = function (event) {
        $scope.playerPosition.x = -$scope.mapPosition.x + event.offsetX;
        $scope.playerPosition.y = -$scope.mapPosition.y + event.offsetY;
        console.log($scope.playerPosition.x + ' ' + $scope.playerPosition.y);
        $scope.redraw();
    };

    var $doc = angular.element(document);
    $doc.on('keydown', keyboardHandler);
    $scope.$on('$destroy', function () {
        $doc.off('keydown', keyboardHandler);
    });

    $scope.redraw = function () {
        var vx = $scope.mapPosition.x % $scope.images.map.width;
        var vy = $scope.mapPosition.y % $scope.images.map.height;

        if (vx > 0) {
            vx -= $scope.images.map.width;
        }
        if (vy > 0) {
            vy -= $scope.images.map.height;
        }

        ctx.drawImage($scope.images.map, vx, vy);
        ctx.drawImage($scope.images.map, vx, $scope.images.map.height - Math.abs(vy));
        ctx.drawImage($scope.images.map, $scope.images.map.width - Math.abs(vx), vy);
        ctx.drawImage($scope.images.map, $scope.images.map.width - Math.abs(vx), $scope.images.map.height - Math.abs(vy));

        var posX = $scope.playerPosition.x + $scope.mapPosition.x - distance;
        var posY = $scope.playerPosition.y + $scope.mapPosition.y - distance;
        ctx.drawImage($scope.images.castle, $scope.castlePosition.x + $scope.mapPosition.x, $scope.castlePosition.y + $scope.mapPosition.y);
        ctx.drawImage($scope.images.bluePlayer, posX, posY);
    };
}]);