function IrfNamibiaAirRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfNamibiaAir', {
            url: '/irf/NamibiaAir:?id&stationId&countryId&isViewing&formName',
            component: 'irfNamibiaAirComponent',
            params: {
                id: null
            }
        });
}

export default IrfNamibiaAirRoutes;
