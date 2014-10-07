'use strict';

app.controller('StatsCtrl', ['$scope', 'appData', 'errorHandler', function ($scope, appData, errorHandler) {
    appData.getGameStatistics()
        .then(function (data) {
            console.log(data);
            $scope.stats = data.stats;
        }, errorHandler);
}]);