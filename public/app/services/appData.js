app.factory('appData', ['$q', '$http', function($q, $http) {
    'use strict';

    function makeRequest(method, url, data) {
        data = data || {};
        var deferred = $q.defer();

        $http[method](url, data).success(function(response) {
            if (response.success) {
                deferred.resolve(response);
            }
            else {
                deferred.resolve(false);
            }
        });

        return deferred.promise;
    }

    return {
        getUserMessages: function() {
            return makeRequest('get', '/api/game-messages');
        },
        createMessage: function(id, textToSend) {
            return makeRequest('post', '/api/game-messages', {
                targetID: id,
                textToSend : textToSend
            });
        },
        deleteMessage: function(id) {
            return makeRequest('delete', '/api/game-messages', {
                messageId: id
            })
        },
        getUserIdByName: function(name) {
            return makeRequest('get', '/api/info/userIdByName/' + name);
        },
        getUserReports: function() {
            return makeRequest('get', '/api/game-reports');
        },
        deleteReport: function(id) {
            return makeRequest('delete', '/api/game-reports', {
                reportId: id
            })
        }
    }
}]);