var app = angular.module('app', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : '/partials/home/home',
                controller: 'HomeCtrl'
            })
        }])
    .controller('HomeCtrl', ['$scope', function($scope) {
        $scope.hello = 'Included Angular';
    }]);