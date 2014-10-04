app.controller('SignUpCtrl', ['$scope', '$location', 'auth', 'notifier', function ($scope, $location, auth, notifier) {
    'use strict';

    $scope.user = {};

    $scope.signup = function (user) {
        auth.signup(user).then(function () {
            notifier.success('Registration successful !');
            $location.path('/');

        }, function() {
            notifier.error('This username already exists !');
        });
    };
}]);