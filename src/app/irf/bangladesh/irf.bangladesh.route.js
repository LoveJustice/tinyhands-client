function IrfBangladeshRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfBangladesh', {
            url: '/irf/bangladesh:?id&stationId&countryId&isViewing',
            component: 'irfBangladeshComponent',
            params: {
                id: null
            }
        });
}

export default IrfBangladeshRoutes;