app.factory('UsersResource', ['$resource', function($resource) {
    'use strict';

    return $resource('/api/users/:id', {_id: '@id'}, {update: {method:'PUT', isArray:false}});
}]);