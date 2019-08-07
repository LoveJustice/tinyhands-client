function IrfTanzaniaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfTanzania', {
            url: '/irf/tanzania:?id&stationId&countryId&isViewing&formName',
            component: 'irfTanzaniaComponent',
            params: {
                id: null
            }
        });
}

export default IrfTanzaniaRoutes;
