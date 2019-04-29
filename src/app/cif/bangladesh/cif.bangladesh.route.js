function CifBangladeshRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('cifBangladesh', {
            url: '/cif/bangladesh:?id&stationId&countryId&isViewing&formName',
            component: 'cifBangladeshComponent',
            params: {
                id: null
            }
        });
}

export default CifBangladeshRoutes;
