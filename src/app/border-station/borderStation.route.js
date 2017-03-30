function borderStationRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:id',
            templateUrl: 'app/border-station/borderStation.html',
            controller: 'BorderStationController',
            controllerAs: 'bsCtrl',
            data: {
                permissions_required: ['permission_border_stations_view']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default borderStationRouteConfig;