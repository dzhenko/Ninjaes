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
                        troops: data.user.troops
                    };

                    scope.castleData = data.castle[0];

                    scope.troopsData = troopsModel;
                    console.log(troopsModel);
                    console.log(data);
                });
        }
    };
}]);