app.directive('playerStats', ['appData', 'troopsModel', function (appData, troopsModel) {

    return{
        templateUrl: '/partials/directives/player-stats',
        replace: true,
        scope: true
    };
}]);