function IrfBangladeshRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfBangladesh', {
            url: '/irf/bangladesh:?id&stationId&countryId&isViewing&formName',
            component: 'irfBangladeshComponent',
            params: {
                id: null
            }
        });
}

export default IrfBangladeshRoutes;