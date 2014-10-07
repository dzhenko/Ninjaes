app.factory('identity', ['$window', 'UsersResource', function($window, UsersResource) {
    'use strict';

    var user;
    if ($window.bootstrappedUserObject) {
        user = new UsersResource();
        angular.extend(user, $window.bootstrappedUserObject);
    }

    return {
        currentUser: user,
        isAuthenticated: function() {
            return !!this.currentUser;
        },
        isAuthorizedForRole: function(role) {
            return !!this.currentUser && this.currentUser.roles.indexOf(role) >= 0;
        },
        isAdmin: function() {
            return !!this.currentUser && this.currentUser.roles.indexOf('admin') >= 0;
        },
        isModerator: function() {
            return !!this.currentUser && this.currentUser.roles.indexOf('moderator') >= 0;
        }
    }
}]);