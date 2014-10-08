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
        },
        getSanitisedUser: function () {
            if (!user) {
                return false;
            }

            return {
                _id : user._id,
                coordinates : user.coordinates,
                experience: user.experience,
                firstName: user.firstName,
                gold: user.gold,
                lastName: user.lastName,
                movement : user.movement,
                troops : user.troops,
                username: user.username
            }
        },
        setSanitisedUser: function(updatedUser) {
            if (!user) {
                return false;
            }

            user.coordinates = updatedUser.coordinates;
            user.experience= updatedUser.experience;
            user.firstName= updatedUser.firstName;
            user.gold= updatedUser.gold;
            user.lastName= updatedUser.lastName;
            user.movement = updatedUser.movement;
            user.troops = updatedUser.troops;
            user.username= updatedUser.username;
        }
    }
}]);