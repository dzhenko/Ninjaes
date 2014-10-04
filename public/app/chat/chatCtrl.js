'use strict';

app.controller('ChatCtrl', ['$scope', 'identity', function($scope, identity) {
    $scope.identity = identity;

    $scope.messages = [];

    var sc = io();
    sc.on('chat message', function(msg){
        $scope.$apply(function() {
            $scope.messages.push(msg);
        })
    });

    $scope.sendMessage = function(message) {
        if (!/\S/.test(message)) {
            return;
        }

        sc.emit('chat message', {
            text : message,
            user: identity.currentUser.username
        });
        $scope.newMessage = '';
    }
}]);