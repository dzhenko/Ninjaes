'use strict';

app.controller('TopScoresCtrl', ['$scope', 'appData', 'errorHandler', 'notifier', function ($scope, appData, errorHandler, notifier) {
    appData.getTopScores()
        .then(function (data) {
            $scope.topScores = data.topUsers;
        }, errorHandler);
}]);