function IrfAfricaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfAfrica', {
            url: '/irf/africa:?id&stationId&countryId&isViewing',
            component: 'irfAfricaComponent',
            params: {
                id: null
            }
        });
}

export default IrfAfricaRoutes;
