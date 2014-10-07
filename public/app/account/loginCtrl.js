app.controller('LoginCtrl', ['$scope', '$location', 'notifier', 'identity', 'auth', 'socket',
    function ($scope, $location, notifier, identity, auth, socket) {
    'use strict';

    $scope.identity = identity;

    $scope.login = function (user, loginForm) {
        if (loginForm.$valid) {
            auth.login(user).then(function (success) {
                if (success) {
                    notifier.success('Successful login!');

                    socket.emit('registerForEvents', {id : identity.currentUser._id, name: identity.currentUser.username});

                    $location.path('/')
                }
                else {
                    notifier.error('Username/Password combination is not valid!');
                }
            });
        }
        else {
            notifier.error('Username and password are required fields!');
        }
    };

    $scope.logout = function () {
        auth.logout().then(function () {
            notifier.success('Successful logout');
            if ($scope.user) {
                $scope.user.email = '';
                $scope.user.username = '';
                $scope.user.password = '';
            }

            $scope.loginForm.$setPristine();
            $location.path('/');
        });
    }
}]);