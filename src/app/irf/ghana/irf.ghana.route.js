function IrfGhanaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfGhana', {
            url: '/irf/ghana:?id&stationId&countryId&isViewing&formName',
            component: 'irfGhanaComponent',
            params: {
                id: null
            }
        });
}

export default IrfGhanaRoutes;
