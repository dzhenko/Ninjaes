'use strict';

app.controller('OverviewCtrl', ['$scope', '$location', 'appData', 'troopsModel', function ($scope, $location, appData, troopsModel) {
    $scope.troopsInfo = troopsModel;

    appData.getUserOverview().then(function (data) {
        $scope.userTroops = data;
    });

    $scope.go = function (path) {
        $location.path(path);
    };
}]);