app.controller('MessageCreateCtrl', ['$scope', '$routeParams', 'appData', 'notifier', 'errorHandler',
    function ($scope, $routeParams, appData, notifier, errorHandler) {
        'use strict';

        $scope.showSentMessage = false;

        $('#showMessageInputBtn').click();

        appData.getUserNameById($routeParams.id).then(function(response) {
            $scope.sentMessageUser = response.username;
        }, errorHandler);

        $scope.sendMessage = function () {
            appData.createMessage($routeParams.id, $scope.textToSend).then(function (response) {
                console.log(response);
                if (!response.success) {
                    notifier.error('Message could not be sent');
                    return;
                }

                notifier.success('Message sent');

                $scope.showSentMessage = true;
                $scope.sentMessageText = $scope.textToSend;
            }, errorHandler);
        };
    }]);