'use strict';

app.controller('BuildingsCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.buyBuilding = function(){
        alert('doesn\'t work yet');
    };

    var  $buildings = angular.element('.buildingName'); // array of the buildings elements from 0 to 15

    for(var i = 0; i < 16; i++){ // sample color setting
        if(i % 2 === 0) {
            $buildings[i].style.backgroundColor = 'red';
        }
        else{
            $buildings[i].style.backgroundColor = 'green';
        }
    }
}]);