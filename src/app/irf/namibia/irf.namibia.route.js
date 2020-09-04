function IrfNamibiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfNamibia', {
            url: '/irf/namibia:?id&stationId&countryId&isViewing&formName',
            component: 'irfNamibiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfNamibiaRoutes;
