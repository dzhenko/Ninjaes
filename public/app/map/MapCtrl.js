﻿'use strict';

app.controller('MapCtrl', ['$scope', '$location', 'identity', 'socket', 'images', 'gameNotifier',
    function ($scope, $location, identity, socket, images, gameNotifier) {
        var distance = 60;
        var coordinates ={
            x: -(identity.currentUser.coordinates.x % 32) * distance,
            y: -(identity.currentUser.coordinates.y % 32) * distance
        };
        console.log(coordinates);

        var handler = function(e){
            e.preventDefault();

            if(e.keyCode === 37) {
                movePlayer(-1,0);
            }
            if(e.keyCode === 38) {
                movePlayer(0,-1);
            }
            if(e.keyCode === 39) {
                movePlayer(1, 0);
            }
            if(e.keyCode === 40) {
                movePlayer(0, 1);
            }
        };

        var $doc = angular.element(document);
        $doc.on('keydown', handler);
        $scope.$on('$destroy',function(){
            $doc.off('keydown', handler);
        });

        var canvas = document.querySelector('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = './../img/world.png';

        var redrawMap = function(dx ,dy){
            coordinates.x -= dx * distance;
            coordinates.y -= dy * distance;

            if (Math.abs(coordinates.x) >= img.width) {
                coordinates.x = 0;
            }
            if (Math.abs(coordinates.y) >= img.height) {
                coordinates.y = 0;
            }
            if(coordinates.x > 0){
                coordinates.x -= img.width;
            }
            if(coordinates.y > 0){
                coordinates.y -= img.height;
            }

            ctx.drawImage(img, coordinates.x, coordinates.y);
            ctx.drawImage(img, coordinates.x, img.height-Math.abs(coordinates.y));
            ctx.drawImage(img, img.width-Math.abs(coordinates.x), coordinates.y);
            ctx.drawImage(img, img.width-Math.abs(coordinates.x), img.height-Math.abs(coordinates.y));
        };

        var drawObjects = function (mapFragment){
            for(var y = 0; y < mapFragment.length; y++){
                for(var x = 0; x < mapFragment[y].length; x++){
                    if(mapFragment[y][x]) {
                        var currObj = mapFragment[y][x];
                        var image;

                        if(currObj.type !== 4){
                            if(currObj.type === 1) {
                                image = images.goldImage;
                            }
                            else if (currObj.type === 2) {
                                image = images.goldImage;
                            }
                            else if (currObj.type === 3) {
                                if (currObj.object._id === identity.currentUser._id) {
                                    // me
                                    //TODO
                                    image = images.goldImage;
                                }
                                else {
                                    //enemy
                                    //TODO
                                    image = images.goldImage;
                                }
                            }

                            ctx.drawImage(image, x * distance, y * distance);
                        }
//                        else if (currObj.object) {
//                            if (currObj.object.owner === identity.currentUser._id) {
//                                //own castle
//                                image = images.castleImage;
//                            }
//                            else {
//                                // enemy castle
//                                //TODO:Change image
//                                image = images.castleImage;
//                            }
//
//
//                        }
                        else {
                            ctx.drawImage(images.castleImage, x * distance - 2*distance, y * distance - 2*distance);
                        }
                    }
                }
            }

        };

        socket.emit('getMap', identity.currentUser.coordinates);

        if (!socket.eventDict['getMap']) {
            socket.eventDict['getMap'] = true;
            socket.on('getMap', handleInitialMapObjects);
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

            redrawMap(response.dx, response.dy);
            drawObjects(response.mapFragment);

            identity.currentUser = response.user;
        }

        function handleInitialMapObjects(receivedMapObjects) {
            console.log('map recieved');
            redrawMap(0,0);
            drawObjects(receivedMapObjects);
        }
    }]);