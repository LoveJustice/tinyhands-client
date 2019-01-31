function IrfMalawiRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfMalawi', {
            url: '/irf/malawi:?id&stationId&countryId&isViewing&formName',
            component: 'irfMalawiComponent',
            params: {
                id: null
            }
        });
}

export default IrfMalawiRoutes;
