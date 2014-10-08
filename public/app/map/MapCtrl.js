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

        images.worldMap.onload = function () {
            redrawMap();
            socket.emit('get map', {
                user: identity.currentUser,
                forced: false
            });
        };

        redrawMap();
        socket.emit('get map', {
            user: identity.currentUser,
            forced: false
        });

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

            ctx.drawImage(images.redPlayer, 8 * images.mapSettings.squareDistance - 15, 5 * images.mapSettings.squareDistance - 20);
        }

        function drawObjects(mapFragment) {
            if (!ctx) {
                ctx = document.getElementById('main-canvas').getContext('2d');
            }

            mapFragment.forEach(function (item) {
                if (item.obj.type === 1) {
                    ctx.drawImage(images.goldImage, item.x * images.mapSettings.squareDistance, item.y * images.mapSettings.squareDistance);
                }
                else if (item.obj.type === 2) {
                    ctx.drawImage(images.monsterImage, item.x * images.mapSettings.squareDistance, item.y * images.mapSettings.squareDistance - 15);
                }
                else if (item.obj.type === 3) {
                    ctx.drawImage(images.bluePlayer, item.x * images.mapSettings.squareDistance, item.y * images.mapSettings.squareDistance);
                }
                else if (item.obj.type === 4) {
                    ctx.drawImage(item.obj.obj.owner.toString() === identity.currentUser._id.toString() ? images.castleImage : images.blueCastle,
                            item.x * images.mapSettings.squareDistance - images.mapSettings.squareDistance,
                            item.y * images.mapSettings.squareDistance - images.mapSettings.squareDistance);
                }
            });
        }

        if (!socket.eventDict['get map']) {
            socket.eventDict['get map'] = true;
            socket.on('get map', drawObjects);
        }

        if (!socket.eventDict['moved']) {
            socket.eventDict['moved'] = true;
            socket.on('moved', handleMovedResponse);
        }

        if (!socket.eventDict['fight monster']) {
            socket.eventDict['fight monster'] = true;
            socket.on('fight monster', handleFightResponse);
        }

        if (!socket.eventDict['fight hero']) {
            socket.eventDict['fight hero'] = true;
            socket.on('fight hero', handleFightResponse);
        }


        if (!socket.eventDict['someone moved']) {
            socket.eventDict['someone moved'] = true;
            socket.on('someone moved', function () {
                socket.emit('get map', {
                    user: identity.currentUser,
                    forced: true
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
                return;
            }

            identity.currentUser = response.user;
            redrawMap();
            drawObjects(response.mapFragment);

            if (response.event === 'null') {
                // nothing special
            }
            else if (response.event === 'gold') {
                gameNotifier.gold(response.object.amount);
            }
            else if (response.event === 'castle') {
                gameNotifier.message('You got your troops!');
            }
            else if (response.event === 'enemy') {
                if (response.object.type === 2) {
                    gameNotifier.enemy(response.object.amount).then(function() {
                        socket.emit('fight monster', {
                            monster : response.object.index,
                            user: identity.currentUser
                        });
                    });
                }
                else if (response.object.type === 4) {
                    gameNotifier.message('Enemy castle - ambush!')
                }
                else {
                    gameNotifier.hero(response.object.amount).then(function() {
                        socket.emit('fight hero', {
                            hero : response.object.obj.coordinates,
                            user: identity.currentUser
                        });
                    });
                }
            }
        }

        function handleFightResponse(response) {
            if (!response) {
                return;
            }

            identity.currentUser = response.user;

            if (response.success) {
                gameNotifier.message('-------You won-------')
            }
            else {
                gameNotifier.message('-------You lost-------')
            }

            socket.emit('moved', {
                user: identity.currentUser,
                dx: 0,
                dy: 0
            });
        }
    }]);