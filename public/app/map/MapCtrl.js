'use strict';

app.controller('MapCtrl', ['$scope', '$location', 'identity', 'socket', 'images', 'gameNotifier',
    function ($scope, $location, identity, socket, images, gameNotifier) {
        var ctx;

        var handler = function (e) {
            e.preventDefault();

            if (e.keyCode === 37) {
                movePlayer(-1, 0);
            }
            else if (e.keyCode === 38) {
                movePlayer(0, -1);
            }
            else if (e.keyCode === 39) {
                movePlayer(1, 0);
            }
            else if (e.keyCode === 40) {
                movePlayer(0, 1);
            }
        };

        var $doc = angular.element(document);
        $doc.on('keydown', handler);
        $scope.$on('$destroy', function () {
            $doc.off('keydown', handler);
            ctx = undefined;
        });

        images.worldMap.onload = function() {
            redrawMap();
        };

        redrawMap();

        function redrawMap(coordinates) {
            coordinates = coordinates || identity.currentUser.coordinates;

            if (!ctx) {
                ctx = document.getElementById('main-canvas').getContext('2d');
            }

            ctx.drawImage(images.worldMap,
                    images.worldMap.width / 3 + (coordinates.x % images.mapSettings.squareCount) * images.mapSettings.squareDistance,
                    images.worldMap.height / 3 + (coordinates.y % images.mapSettings.squareCount) * images.mapSettings.squareDistance,
                    images.mapSettings.visibleWidthSquares * images.mapSettings.squareDistance,
                    images.mapSettings.visibleHeightSquares * images.mapSettings.squareDistance,
                0, 0,
                    images.mapSettings.visibleWidthSquares * images.mapSettings.squareDistance,
                    images.mapSettings.visibleHeightSquares * images.mapSettings.squareDistance);
        }

        function drawObjects(mapFragment) {
            if (!ctx) {
                ctx = document.getElementById('main-canvas').getContext('2d');
            }

            mapFragment.forEach(function(item) {
                if (item.obj.type === 1) {
                    ctx.drawImage(images.goldImage, item.x * images.mapSettings.squareDistance, item.y * images.mapSettings.squareDistance);
                }
                else if (item.obj.type === 2) {
                    ctx.drawImage(images.monsterImage, item.x * images.mapSettings.squareDistance, item.y * images.mapSettings.squareDistance - 15);
                }
            })
        }

        socket.emit('get map', {
            user : identity.currentUser,
            forced : false
        });

        if (!socket.eventDict['get map']) {
            socket.eventDict['get map'] = true;
            socket.on('get map', drawObjects);
        }

        if (!socket.eventDict['moved']) {
            socket.eventDict['moved'] = true;
            socket.on('moved', handleMovedResponse);
        }

        if (!socket.eventDict['someone moved']) {
            socket.eventDict['someone moved'] = true;
            socket.on('someone moved', function() {
                socket.emit('get map', {
                    user : identity.currentUser,
                    forced : true
                });
            });
        }

        function movePlayer(dx, dy) {
            socket.emit('moved', {
                user: identity.currentUser,
                dx: dx,
                dy: dy
            });
        }

        function handleMovedResponse(response) {
            if (!response) {
                // no movement or wrong coords
            }
            else {
                identity.currentUser = response.user;
                redrawMap();
                drawObjects(response.mapFragment);
            }
        }
    }]);