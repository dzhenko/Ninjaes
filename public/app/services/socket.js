app.factory('socket', [function() {
    'use strict';

    var sc;

    function getSc() {
        if (!sc) {
            sc = io();
        }

        return sc;
    }

    return {
        on : function(event, cb) {
            getSc().on(event, cb);
        },
        emit: function(event, data) {
            getSc().emit(event, data);
        }
    }
}]);