app.controller('MessageViewCtrl', ['$scope', 'appData', 'identity', 'notifier', 'errorHandler',
    function ($scope, appData, identity, notifier, errorHandler) {
        'use strict';

        function getUserMessages() {
            appData.getUserMessages().then(function (response) {
                if (!response.success) {
                    notifier.error(response.reason);
                    return;
                }

                $scope.allMessages = response.messages;
            }, errorHandler);
        }

        getUserMessages();

        $scope.deleteMessage = function (id) {
            appData.deleteMessage(id).then(function (response) {
                if (!response.success) {
                    notifier.error(response.reason);
                    return;
                }

                notifier.success('Message deleted!');

                getUserMessages();
            }, errorHandler)
        };

        $scope.viewMessage = function (index) {
            $scope.selectedMessage = $scope.allMessages[$scope.allMessages.length - index - 1];
        }
    }]);