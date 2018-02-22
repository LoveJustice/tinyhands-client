import borderStationTemplate from './borderStation.html';

function borderStationRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:id',
            templateUrl: borderStationTemplate,
            controller: 'BorderStationController',
            controllerAs: 'bsCtrl',
            params: {
                id: "",
                countryId: null
            }
        });
}

export default borderStationRouteConfig;