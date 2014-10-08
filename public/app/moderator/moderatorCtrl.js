'use strict';

app.controller('ModeratorCtrl', ['$scope','socket', function ($scope, socket) {
    $scope.sendMessage = function(message) {
        socket.emit('mass message', message);
    }
}]);