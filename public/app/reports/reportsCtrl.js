app.controller('ReportsCtrl', ['$scope', 'appData', 'troopsModel', 'errorHandler',
    function ($scope, appData, troopsModel, errorHandler) {
        'use strict';

        $scope.troopsModel = troopsModel;

        function getUserReports() {
            appData.getUserReports().then(function (response) {
                if (!response.success) {
                    notifier.error(response.reason);
                }

                $scope.allReports = response.reports;
            }, errorHandler);
        }

        getUserReports();

        $scope.deleteReport = function (id) {
            appData.deleteReport(id).then(function (response) {
                if (!response.success) {
                    notifier.error(response.reason);
                }

                notifier.success('Report deleted!');

                getUserReports();
            }, errorHandler)
        };

        $scope.viewReport = function (index) {
            $scope.selectedReport = $scope.allReports[$scope.allReports.length - index - 1];
            $scope.titleText = $scope.selectedReport.win ? 'You win' : 'You loose';
            $scope.titleClass = $scope.selectedReport.win ? 'text-success' : 'text-danger';
        }
    }]);