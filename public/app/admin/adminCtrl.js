'use strict';

app.controller('AdminCtrl', ['$scope','massNotifier', function ($scope, massNotifier) {
    $scope.sendMessage = function(message) {
        massNotifier.show(message);
    }
}]);