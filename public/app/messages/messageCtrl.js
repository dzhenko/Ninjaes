app.controller('MessageCtrl', ['$scope', '$location', 'notifier', 'identity', 'appData', 'errorHandler',
    function ($scope, $location, notifier, identity, appData, errorHandler) {
    'use strict';

    $scope.confirmUsername = function () {
//        if (identity.currentUser.username == $scope.targetUsername) {
//            notifier.error('You can not write to yourself');
//            return;
//        }
        appData.getUserIdByName($scope.targetUsername).then(function (response) {
            if (response.success) {
                $location.path('/message-create/' + response.id);
            }
            else {
                notifier.error(response.reason);
            }

        }, errorHandler);
    };
}]);