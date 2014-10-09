'use strict';

app.controller('TroopsCtrl', ['$scope', '$location', 'appData', 'troopsModel', 'troopsOverviewNotifier', 'socket', 'identity','gameNotifier',
    function ($scope, $location, appData, troopsModel, troopsOverviewNotifier, socket, identity, gameNotifier) {
        appData.getUserOverview().then(function (data) {
            $scope.userTroops = data;
        });

        $scope.troopsInfo = troopsModel;

        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.recalculatePurchaseInfo = function (unitInfo) {
            var maxUnitsFromUserGold = parseInt($scope.userTroops.user.gold / unitInfo.cost);
            var unitsForSale = $scope.userTroops.castle[0].troopsForSale[unitInfo.id];
            var available = Math.min(maxUnitsFromUserGold, unitsForSale);
            $scope.purchaseInfo = {
                available: available,
                recruit: 0,
                totalCost: 0
            }
        };

        $scope.recruit = function (troop, purchaseInfo) {
            troopsOverviewNotifier.recruit(troop, purchaseInfo)
                .then(buyTroops, function () {}, function (update) {
                    $scope.purchaseInfo = update;
                    troopsOverviewNotifier.updateRecruits($scope.purchaseInfo.recruit, $scope.purchaseInfo.totalCost);
                });
        };

        function buyTroops(index) {
            socket.emit('buy troops', {
                user : identity.currentUser,
                castle :$scope.userTroops.castle[0],
                request : {
                    index : index,
                    amount : $scope.purchaseInfo.recruit
                }
            });
        }

        if (!socket.eventDict['buy troops']) {
            socket.eventDict['buy troops'] = true;
            socket.on('buy troops', handleBuyTroops);
        }

        console.log(identity.currentUser);

        function handleBuyTroops(response) {
            console.log(response);
            if (!response.success) {
                gameNotifier.message('Not enough money!');
            }

            gameNotifier.message('-------Success-------');

            identity.currentUser = response.user;
            appData.getUserOverview().then(function (data) {
                $scope.userTroops = data;
            });
        }
    }]);