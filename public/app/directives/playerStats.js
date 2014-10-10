app.directive('playerStats', ['appData', 'troopsModel', function (appData, troopsModel) {

    return{
        templateUrl: '/partials/directives/player-stats',
        replace: true,
        scope: {},
        link: function (scope, element) {
            appData.getUserOverview()
                .then(function (data) {
                    scope.playerData = {
                        gold: data.user.gold,
                        experience: data.user.experience,
                        movement: data.user.movement,
                        troops: data.user.troops
                    };

                    scope.castleData = data.castle;

                    scope.troopsData = troopsModel;
                });
        }
    };
}]);