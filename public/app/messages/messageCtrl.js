app.controller('MessageCtrl', ['$scope', '$location', 'notifier', 'identity', function ($scope, $location, notifier, identity) {
    'use strict';

    $scope.confirmUsername = function () {
        if (identity.currentUser.username == $scope.targetUsername) {
            notifier.error('You can not write to yourself');
            return;
        }
        GameRequests.findUserIdByUsername($scope.targetUsername).then(function (id) {
            $location.path('/message-create/' + id);

        }, function (error) {
            notifier.error(error);
        });
    };
}]);