app.controller('MessageCreateCtrl', ['$scope', '$routeParams', 'appData', 'notifier', 'errorHandler',
    function ($scope, $routeParams, appData, notifier, errorHandler) {
        'use strict';

        $scope.showSentMessage = false;

        $('#showMessageInputBtn').click();

        $scope.sendMessage = function () {
            appData.createMessage($routeParams.id, $scope.textToSend).then(function (response) {
                if (!response.success) {
                    notifier.error('Message could not be sent');
                    return;
                }

                notifier.success('Message sent');
                $scope.showSentMessage = true;
                $scope.sentMessageText = ''

            }, errorHandler);
        };
    }]);