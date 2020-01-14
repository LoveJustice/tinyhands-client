function IrfRwandaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfRwanda', {
            url: '/irf/rwanda:?id&stationId&countryId&isViewing&formName',
            component: 'irfRwandaComponent',
            params: {
                id: null
            }
        });
}

export default IrfRwandaRoutes;
