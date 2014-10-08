'use strict';

app.controller('MapCtrl', ['$scope', '$location', 'identity', 'socket', 'images', 'gameNotifier',
    function ($scope, $location, identity, socket, images, gameNotifier) {
        redrawMap(identity.currentUser.coordinates);

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
        });

        var ctx = document.querySelector('canvas').getContext('2d');

        function redrawMap(coordinates) {
            ctx.drawImage(images.worldMap,
                    (coordinates.x % images.mapSettings.squareCount) * images.mapSettings.squareDistance,
                    (coordinates.y % images.mapSettings.squareCount) * images.mapSettings.squareDistance,
                    images.mapSettings.visibleWidthSquares * images.mapSettings.squareDistance,
                    images.mapSettings.visibleHeightSquares * images.mapSettings.squareDistance,
                0, 0,
                    images.mapSettings.visibleWidthSquares * images.mapSettings.squareDistance,
                    images.mapSettings.visibleHeightSquares * images.mapSettings.squareDistance);
        }

        function drawObjects(mapFragment) {
            console.log(mapFragment);
//            ctx.drawImage(images.castleImage, x * sqrDistance - sqrDistance, y * sqrDistance - sqrDistance);
//            mapObjects.forEach(function(obj) {
//
//            });
        }

        socket.emit('getMap', identity.currentUser.coordinates);

        if (!socket.eventDict['getMap']) {
            socket.eventDict['getMap'] = true;
            socket.on('getMap', drawObjects);
        }

        if (!socket.eventDict['moved']) {
            socket.eventDict['moved'] = true;
            socket.on('moved', handleMovedResponse);
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
                // out of movement
                return;
            }

            console.log('moved recieved');

            redrawMap(response.user.coordinates);
            drawObjects(response.mapFragment);
            identity.currentUser = response.user;
        }
    }]);