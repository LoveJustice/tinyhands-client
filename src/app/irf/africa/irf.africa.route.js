function IrfAfricaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfAfrica', {
            url: '/irf/africa:?id&stationId&countryId&isViewing&formName',
            component: 'irfAfricaComponent',
            params: {
                id: null
            }
        });
}

export default IrfAfricaRoutes;
