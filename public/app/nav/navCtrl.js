'use strict';

app.controller('NavCtrl', ['$scope', 'identity', function ($scope, identity) {
    $scope.identity = identity;
}]);