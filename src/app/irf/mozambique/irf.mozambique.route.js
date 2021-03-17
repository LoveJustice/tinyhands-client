function IrfMozambiqueRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfMozambique', {
            url: '/irf/mozambique:?id&stationId&countryId&isViewing&formName',
            component: 'irfMozambiqueComponent',
            params: {
                id: null
            }
        });
}

export default IrfMozambiqueRoutes;
