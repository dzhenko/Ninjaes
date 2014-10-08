'use strict';

app.controller('AdminCtrl', ['$scope','socket', function ($scope, socket) {
    $scope.sendMessage = function(message) {
        socket.emit('mass message', message);
    }
}]);