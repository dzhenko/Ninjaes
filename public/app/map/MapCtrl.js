'use strict';

app.controller('MapCtrl', ['$scope', '$location', 'mapData', function ($scope, $location, mapData) {
    $scope.params = {};
    $scope.vx = 0;
    $scope.vy = 0;
    var distance = 60;

    var handler = function(e){
        if(e.keyCode === 37) {
            // console.log('lef arrow');
            $scope.vx += distance;
            $scope.redraw();
        }
        if(e.keyCode === 38) {
            // console.log('up arrow');
            $scope.vy += distance;
            $scope.redraw();
        }
        if(e.keyCode === 39) {
            // console.log('right arrow');
            $scope.vx -= distance;
            $scope.redraw();
        }
        if(e.keyCode === 40) {
            // console.log('down arrow');
            $scope.vy -= distance;
            $scope.redraw();
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

    $scope.redraw = function(){
        if (Math.abs($scope.vx) > img.width) {
            $scope.vx = 0;
        }
        if (Math.abs($scope.vy) > img.height) {
            $scope.vy=0;
        }
        if($scope.vx > 0){
            $scope.vx -= img.width;
        }
        if($scope.vy > 0){
            $scope.vy -= img.height;
        }
        var vx = $scope.vx;
        var vy = $scope.vy;

        ctx.drawImage(img, vx, vy);
        ctx.drawImage(img, vx, img.height-Math.abs(vy));
        ctx.drawImage(img, img.width-Math.abs(vx), vy);
        ctx.drawImage(img, img.width-Math.abs(vx), img.height-Math.abs(vy));
    };
}]);