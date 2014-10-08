'use strict';

app.controller('ProfileCtrl', ['$scope', 'identity', function ($scope, identity) {
    $scope.userInfo = {
        username: identity.currentUser.username,
        firstName: identity.currentUser.firstName,
        lastName: identity.currentUser.lastName
    };
}]);