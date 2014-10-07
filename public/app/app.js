'use strict';

var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', '$sceDelegateProvider', function ($routeProvider, $sceDelegateProvider) {
    // if we use images from internet we need to allow the website
    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);

    var routeUserChecks = {
        adminRole: {
            authenticate: function (auth) {
                return auth.isAuthorizedForRole('admin');
            }
        },
        moderatorRole: {
            authenticate: function (auth) {
                return auth.isAuthorizedForRole('moderator');
            }
        },
        authenticated: {
            authenticate: function (auth) {
                return auth.isAuthenticated();
            }
        }
    };

    $routeProvider
        .when('/', {
            templateUrl: '/partials/home/home',
            controller: 'HomeCtrl'
            // public
        })
        .when('/home', {
            templateUrl: '/partials/home/home',
            controller: 'HomeCtrl'
            // public
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'SignUpCtrl'
            // public
        })
        .when('/map', {
            templateUrl: '/partials/map/map',
            controller: 'MapCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/castle', {
            templateUrl: '/partials/castle/castle',
            controller: 'CastleCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/troops', {
            templateUrl: '/partials/troops/troops',
            controller: 'TroopsCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/admin', {
            templateUrl: '/partials/admin/admin',
            controller: 'AdminCtrl',
            resolve: routeUserChecks.adminRole
        })
        .when('/messages', {
            templateUrl: '/partials/messages/messageView',
            controller: 'MessageViewCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/message-create', {
            templateUrl: '/partials/messages/message',
            controller: 'MessageCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/message-create/:id', {
            templateUrl: '/partials/messages/messageCreate',
            controller: 'MessageCreateCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/moderator', {
            templateUrl: '/partials/moderator/moderator',
            controller: 'ModeratorCtrl',
            resolve: routeUserChecks.moderatorRole
        })
        .when('/profile', {
            templateUrl: '/partials/profile/profile',
            controller: 'ProfileCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/overview', {
            templateUrl: '/partials/overview/overview',
            controller: 'OverviewCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/reports', {
            templateUrl: '/partials/reports/reports',
            controller: 'ReportsCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/settings', {
            templateUrl: '/partials/settings/settings',
            controller: 'SettingsCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/stats', {
            templateUrl: '/partials/stats/stats',
            controller: 'StatsCtrl'
            // public
        })
        .when('/top-scores', {
            templateUrl: '/partials/top-scores/top-scores',
            controller: 'TopScoresCtrl'
            // public
        })
        .when('/chat', {
            templateUrl: '/partials/chat/chat',
            controller: 'ChatCtrl'
            // public
        })
        .otherwise({ redirectTo: '/' });
}]);

app.value('toastr', toastr);

// default error handling for the app
app.value('errorHandler', function (error) {
    if (error.message) {
        toastr.error(error.message);
    }
    else {
        console.warn(error);
    }
});

app.run(['$rootScope', '$location', function ($rootScope, $location) {
    'use strict';

    $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    })
}]);

//app.run(['socket', function(socket){
//}]);