'use strict';

app.controller('CastleCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.castle = angular.element($(".castle"));
    $scope.bgSize = '1000px 790px';

    var background = 'url("../../img/insideCastle.jpg")';
    var backgroundBuild = 'url("../../img/insideCastle-build.jpg")';
    var backgroundTroops = 'url("../../img/insideCastle-troops.jpg")';

    $scope.bgInit = function(){
        $scope.background = background;
    };
    $scope.getBuildBackground = function(){
        $scope.background = backgroundBuild;
    };
    $scope.getTroopsBackground = function(){
        $scope.background = backgroundTroops;
    };
}]);