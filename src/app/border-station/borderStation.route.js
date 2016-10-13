function borderStationRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:id',
            templateUrl: 'app/border-station/borderStation.html',
            controller: 'BorderStationController',
            controllerAs: 'bsCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default borderStationRouteConfig;