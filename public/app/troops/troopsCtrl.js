'use strict';

app.controller('TroopsCtrl', ['$scope', '$location', 'appData', 'troopsModel', 'overviewNotifier', function ($scope, $location, appData, troopsModel, overviewNotifier) {
    $scope.troopsInfo = troopsModel;

    $scope.recruit = function (troop, purchaseInfo) {
        overviewNotifier.recruit(troop, purchaseInfo)
            .then(function (data) {
                console.log('Successful units purchase!');
            }, function (reason) {
                console.log('Purchase window closed!');
            }, function (update) {
                console.log('Purchase information updated!');
                $scope.purchaseInfo = update;
                overviewNotifier.updateRecruits($scope.purchaseInfo.recruit);
            });
    };

    appData.getUserOverview().then(function (data) {
        $scope.userTroops = data;
    });


    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.recalculatePurchaseInfo = function (unitInfo) {
        var maxUnitsFromUserGold = parseInt($scope.userTroops.user.gold / unitInfo.cost);
        var unitsForSale = $scope.userTroops.castle[0].troopsForSale[unitInfo.id];
        var available = Math.min(maxUnitsFromUserGold, unitsForSale);
        $scope.purchaseInfo = {
            available: available,
            totalCost: unitInfo.cost * available,
            recruit: 0
        }
    };
}]);