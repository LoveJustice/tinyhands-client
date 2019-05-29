function IrfUgandaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfUganda', {
            url: '/irf/uganda:?id&stationId&countryId&isViewing&formName',
            component: 'irfUgandaComponent',
            params: {
                id: null
            }
        });
}

export default IrfUgandaRoutes;
