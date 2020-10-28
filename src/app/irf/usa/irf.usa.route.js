function IrfUsaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfUSA', {
            url: '/irf/usa:?id&stationId&countryId&isViewing&formName',
            component: 'irfUsaComponent',
            params: {
                id: null
            }
        });
}

export default IrfUsaRoutes;
