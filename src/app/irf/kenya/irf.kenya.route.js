function IrfKenyaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfKenya', {
            url: '/irf/kenya:?id&stationId&countryId&isViewing',
            component: 'irfKenyaComponent',
            params: {
                id: null
            }
        });
}

export default IrfKenyaRoutes;
