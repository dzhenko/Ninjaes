app.factory('appData', ['requester', function(requester) {
    'use strict';

    return {
        findUserIdByUsername : function(username) {
            return requester.get('')
        }
    }
}]);