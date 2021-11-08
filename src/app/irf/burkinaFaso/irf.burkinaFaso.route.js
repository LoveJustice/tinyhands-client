function IrfBurkinaFasoRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfBurkinaFaso', {
            url: '/irf/burkinaFaso:?id&stationId&countryId&isViewing&formName',
            component: 'irfBurkinaFasoComponent',
            params: {
                id: null
            }
        });
}

export default IrfBurkinaFasoRoutes;
