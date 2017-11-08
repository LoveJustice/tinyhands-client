import borderStationTemplate from './borderStation.html';

function borderStationRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:id',
            templateUrl: borderStationTemplate,
            controller: 'BorderStationController',
            controllerAs: 'bsCtrl',
            data: {
                permissions_required: ['permission_border_stations_view']
            }
        });
}

export default borderStationRouteConfig;