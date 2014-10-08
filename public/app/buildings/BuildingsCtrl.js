'use strict';
//'buildNotifier', 'buildingsModel',
app.controller('BuildingsCtrl', ['$scope', '$location','identity','appData','buildNotifier','buildingsModel', 'errorHandler',
    function ($scope, $location,identity, appData, buildNotifier ,buildingsModel, errorHandler) {
    appData.getUserCastle().then(function(response){
        if (!response.success) {
            return;
        }

        $scope.buildingsModel = buildingsModel;

        $scope.hallName = response.castle.buildings.hall === 3 ? buildingsModel.hall.name[response.castle.buildings.hall] : buildingsModel.hall.name[response.castle.buildings.hall + 1];
        $scope.castleName = response.castle.buildings.castle === 3 ? buildingsModel.castle.name[response.castle.buildings.castle] : buildingsModel.castle.name[response.castle.buildings.castle + 1];

        $scope.castle = response.castle;

        $scope.showBuyWindow = function(index){
            if (index === 0) {
                if (response.castle.buildings.hall === 3) {
                    buildNotifier.showBuyWindow(buildingsModel.hall.name[response.castle.buildings.hall], 0);
                }
                else {
                    buildNotifier.showBuyWindow(buildingsModel.hall.name[response.castle.buildings.hall + 1],
                        buildingsModel.hall.cost[response.castle.buildings.hall + 1], true).then(function() {
                            buyBuilding(index);
                        })
                }
            }
            else if (index === 1) {
                if (response.castle.buildings.castle === 3) {
                    buildNotifier.showBuyWindow(buildingsModel.castle.name[response.castle.buildings.castle], 0);
                }
                else {
                    buildNotifier.showBuyWindow(buildingsModel.castle.name[response.castle.buildings.castle + 1],
                        buildingsModel.castle.cost[response.castle.buildings.castle + 1], true).then(function() {
                            buyBuilding(index);
                        })
                }
            }
            else if (index < 9) {
                buildNotifier.showBuyWindow(buildingsModel.other[index - 2].name, 0)
            }
            else {
                if (response.castle.buildings.troops[index - 9]) {
                    // we have this building
                    buildNotifier.showBuyWindow(buildingsModel.troops[index - 9].name, 0);
                }
                else {
                    buildNotifier.showBuyWindow(buildingsModel.troops[index - 9].name, buildingsModel.troops[index - 9].cost,
                            index === 9 ? true : response.castle.buildings.troops[index - 10]).then(function() {
                            buyBuilding(index);
                        });
                }
            }
        };

        function buyBuilding(index) {
            var building = index > 1 ? 'troops' : index === 0 ? 'hall' : 'castle';
            var indexRequired = index > 1 ? index - 9 : 0;

            appData.build({building: building, index: indexRequired}).then(function(response){
                if (!response.success) {
                    buildNotifier.showBuyWindow(false,10,false);
                    return;
                }

                buildNotifier.showBuyWindow(false,-10,false).then(function() {
                    $scope.castle = response.castle;
                    $location.path('/castle');
                });
            }, errorHandler);
        }

        // coloring
        var $buildings = angular.element('.buildingName'); // array of the buildings elements from 0 to 15

        var yellow = '#A57E21';
        var green = 'green';
        var red = 'red';

        $buildings[0].style.backgroundColor = response.castle.buildings.hall === 3 ? yellow :
                identity.currentUser.gold >= buildingsModel.hall.cost[response.castle.buildings.hall + 1] ? green : red;

        $buildings[1].style.backgroundColor = response.castle.buildings.castle === 3 ? yellow :
                identity.currentUser.gold >= buildingsModel.castle.cost[response.castle.buildings.castle + 1] ? green : red;

        for(var j = 2; j < 9; j++){ // sample color setting
            $buildings[j].style.backgroundColor = yellow;
        }

        $buildings[9].style.backgroundColor = response.castle.buildings.troops[0] ? yellow :
                identity.currentUser.gold >= buildingsModel.troops[0].cost ? green : red;

        for(var i = 10; i < 16; i++){ // sample color setting
            // console.log(response.castle.buildings.troops[i - 9]);
            if (response.castle.buildings.troops[i - 9]) {
                $buildings[i].style.backgroundColor = yellow;
            }
            else if (response.castle.buildings.troops[i - 10]){
                $buildings[i].style.backgroundColor = identity.currentUser.gold >= buildingsModel.troops[i - 10].cost ? green : red;
            }
            else {
                $buildings[i].style.backgroundColor = red;
            }
        }
    }, errorHandler);
}]);