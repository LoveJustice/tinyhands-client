function IrfBeninRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfBenin', {
            url: '/irf/benin:?id&stationId&countryId&isViewing&formName',
            component: 'irfBeninComponent',
            params: {
                id: null
            }
        });
}

export default IrfBeninRoutes;
