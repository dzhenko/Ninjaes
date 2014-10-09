'use strict';

app.controller('SettingsCtrl', ['$scope', '$location', 'auth', 'notifier', function ($scope, $location, auth, notifier) {

    $scope.user = {};

    $scope.update = function (user) {
        auth.update(user).then(function () {
            notifier.success('Changes were successful!');

        }, function() {
            notifier.error('Error!');
        });
    };
}]);