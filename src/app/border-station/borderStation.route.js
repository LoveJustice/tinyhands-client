import borderStationTemplate from './borderStation.html';

function borderStationRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:id',
            templateUrl: borderStationTemplate,
            controller: 'BorderStationController',
            controllerAs: 'bsCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default borderStationRouteConfig;