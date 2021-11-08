function IrfLiberiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfLiberia', {
            url: '/irf/liberia:?id&stationId&countryId&isViewing&formName',
            component: 'irfLiberiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfLiberiaRoutes;
