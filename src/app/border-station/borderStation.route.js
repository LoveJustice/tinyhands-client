function borderStationRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:id',
            component: 'borderStationComponent',
            params: {
                id: null,
                countryId: null
            }
        });
}

export default borderStationRouteConfig;