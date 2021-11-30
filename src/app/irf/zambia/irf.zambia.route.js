function IrfZambiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfZambia', {
            url: '/irf/zambia:?id&stationId&countryId&isViewing&formName',
            component: 'irfZambiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfZambiaRoutes;
