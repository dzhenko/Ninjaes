'use strict';

app.controller('CastleCtrl', ['$scope', function ($scope) {
    $scope.bgSize = '1000px 790px';
    $scope.background =background;

    var background = 'url("../../img/insideCastle.jpg")';
    var backgroundBuild = 'url("../../img/insideCastle-build.jpg")';
    var backgroundTroops = 'url("../../img/insideCastle-troops.jpg")';

    $scope.getBuildBackground = function(){
        $scope.background =backgroundBuild;
    };
    $scope.looseBuildBackground = function() {
        $scope.background =background;
    };
    $scope.getTroopsBackground = function(){
        $scope.background =backgroundTroops;
    };

    $scope.looseTroopsBackground = function() {
        $scope.background =background;
    };
}]);