function IrfBurundiRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfBurundi', {
            url: '/irf/burundi:?id&stationId&countryId&isViewing&formName',
            component: 'irfBurundiComponent',
            params: {
                id: null
            }
        });
}

export default IrfBurundiRoutes;
