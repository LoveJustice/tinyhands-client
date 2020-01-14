function IrfCambodiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfCambodia', {
            url: '/irf/cambodia:?id&stationId&countryId&isViewing&formName',
            component: 'irfCambodiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfCambodiaRoutes;
