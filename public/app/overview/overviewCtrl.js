'use strict';

app.controller('OverviewCtrl', ['$scope', 'appData', 'troopsModel', 'overviewNotifier', function ($scope, appData, troopsModel, overviewNotifier) {
    $scope.recruit = overviewNotifier.recruit;

    appData.getUserOverview().then(function (data) {
        console.log(data);
        $scope.userTroops = data;
    });

    $scope.troopsInfo = troopsModel;
    console.log(troopsModel);
}]);