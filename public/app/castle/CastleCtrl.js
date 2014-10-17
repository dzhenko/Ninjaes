'use strict';

app.controller('CastleCtrl', ['$scope','$location','identity', 'troopsModel', function ($scope, $location, identity, troopsModel) {
    $scope.bgSize = '1000px 790px';

    $scope.background = 'url("../../img/insideCastle.jpg")';
    $scope.backgroundBuild = 'url("../../img/insideCastle-build.jpg")';
    $scope.backgroundTroops = 'url("../../img/insideCastle-troops.jpg")';

    $scope.playerData = identity.currentUser;
    $scope.troopsData = troopsModel;

    $scope.showOriginal =true;
    $scope.showBuild =false;
    $scope.showTroops =false;

    $scope.getBuildBackground = function(){
        $scope.showOriginal =false;
        $scope.showBuild =true;
        $scope.showTroops =false;
    };
    $scope.looseBuildBackground = function() {
        $scope.showOriginal =true;
        $scope.showBuild =false;
        $scope.showTroops =false;
    };
    $scope.getTroopsBackground = function(){
        $scope.showOriginal =false;
        $scope.showBuild =false;
        $scope.showTroops =true;
    };

    $scope.looseTroopsBackground = function() {
        $scope.showOriginal =true;
        $scope.showBuild =false;
        $scope.showTroops =false;
    };

    $scope.go = function(where) {
        console.log(where);
        $location.path(where);
    }
}]);