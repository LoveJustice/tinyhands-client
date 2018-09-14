function IrfMalawiRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfMalawi', {
            url: '/irf/malawi:?id&stationId&countryId&isViewing',
            component: 'irfMalawiComponent',
            params: {
                id: null
            }
        });
}

export default IrfMalawiRoutes;
