'use strict';

var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', '$sceDelegateProvider', function ($routeProvider, $sceDelegateProvider) {
    // if we use images from internet we need to allow the website
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://img*.wikia.nocookie.net/**'
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
        })
        .when('/home', {
            templateUrl: '/partials/home/home',
            controller: 'HomeCtrl'
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'SignUpCtrl'
        })
        .when('/chat', {
            templateUrl: '/partials/chat/chat',
            controller: 'ChatCtrl'
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
        .otherwise({ redirectTo: '/' });
}]);

app.value('toastr', toastr);

// default error handling for the app
app.value('errorHandler', function (error) {
    if (error.message) {
        toastr.error(error.message);
    }
});

app.run(function ($rootScope, $location) {
    'use strict';

    $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    })
});