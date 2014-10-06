'use strict';

app.controller('MapCtrl', ['$scope', '$location', 'identity', 'mapData', 'mapPreloader', 'GameObject',
    function ($scope, $location, identity, mapData, mapPreloader, GameObject) {
        $scope.images = {};
        var gameObjectsImages = [
            {name: 'castle', src: '../../img/castle-building.gif'},
            {name: 'bluePlayer', src: '../../img/bluePlayer.png'},
            {name: 'map', src: './../img/world.png'}
        ];


        $scope.map = {
            position: {
                x: 0,
                y: 0
            },
            distance: 60,
            canvas: document.querySelector('canvas'),
            ctx: function () {
                return this.canvas.getContext('2d');
            },
            width: function () {
                return this.canvas.width;
            },
            height: function () {
                return this.canvas.height;
            }
        };

        $scope.player = new GameObject('Mighty warrior', 'bluePlayer', {x: 200, y: 200});
        $scope.mapObjects = [
            new GameObject('King\'s landing', 'castle', {x: 0, y: 0}),
            $scope.player
        ];

        mapPreloader.preloadImages(gameObjectsImages)
            .then(function (images) {
                $scope.images = images;
                loadGameObjectsImages($scope.images, $scope.mapObjects);
                $scope.drawField();
            });

        var $doc = angular.element(document);
        $doc.on('keydown', keyboardHandler);
        $scope.$on('$destroy', function () {
            $doc.off('keydown', keyboardHandler);
        });

        $scope.drawField = function () {
            drawMap($scope.map, $scope.images.map);

            for (var i = 0; i < $scope.mapObjects.length; i++) {
                var mapObject = $scope.mapObjects[i];
                if (mapObject.isInMapRange($scope.map)) {
                    var positionOnMap = calculateMapPosition(mapObject.position, $scope.map.position, $scope.map.distance);
                    $scope.map.ctx().drawImage($scope.images[mapObject.type], positionOnMap.x, positionOnMap.y);
                }
            }
        };

        function drawMap(map, mapImage) {
            var vx = map.position.x % mapImage.width;
            var vy = map.position.y % mapImage.height;

            if (vx > 0) {
                vx -= mapImage.width;
            }
            if (vy > 0) {
                vy -= mapImage.height;
            }

            map.ctx().drawImage(mapImage, vx, vy);
            map.ctx().drawImage(mapImage, vx, mapImage.height - Math.abs(vy));
            map.ctx().drawImage(mapImage, mapImage.width - Math.abs(vx), vy);
            map.ctx().drawImage(mapImage, mapImage.width - Math.abs(vx), mapImage.height - Math.abs(vy));
        }

        function calculateMapPosition(objectPosition, mapPosition, distance) {
            return {
                x: objectPosition.x + mapPosition.x - distance,
                y: objectPosition.y + mapPosition.y - distance
            };
        }

        function loadGameObjectsImages(images, gameObjects) {
            for (var i = 0; i < gameObjects.length; i++) {
                gameObjects[i].loadImage(images);
            }
        }

        $scope.movePlayer = function (event) {
            $scope.player.position.x = -$scope.map.position.x + event.offsetX;
            $scope.player.position.y = -$scope.map.position.y + event.offsetY;
            $scope.drawField();
        };


        function keyboardHandler(e) {
            // Arrow key press navigates through the page by default
            // so this default should be prevented to move only on the map
            // using arrow keys
            e.preventDefault();

            if (e.keyCode === 37) {
                // console.log('left arrow');
                $scope.map.position.x += $scope.map.distance;
                movePlayer(-1, 0);
            } else if (e.keyCode === 38) {
                // console.log('up arrow');
                $scope.map.position.y += $scope.map.distance;
                movePlayer(0, -1);
            } else if (e.keyCode === 39) {
                // console.log('right arrow');
                $scope.map.position.x -= $scope.map.distance;
                movePlayer(1, 0);
            } else if (e.keyCode === 40) {
                // console.log('down arrow');
                $scope.map.position.y -= $scope.map.distance;
                movePlayer(0, 1);
            }
        }


        var sc = io();
        sc.on('moved', function(response) {
            if (!response) {

                return;
            }
            $scope.drawField();
            identity.currentUser = response.user;
            console.log(response);
        });

        function movePlayer(dx, dy) {
            sc.emit('moved', {
                user: identity.currentUser,
                dx: dx,
                dy: dy
            });
        }
    }]);