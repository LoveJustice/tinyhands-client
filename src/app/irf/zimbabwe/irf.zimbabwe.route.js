function IrfZimbabweRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfZimbabwe', {
            url: '/irf/zimbabwe:?id&stationId&countryId&isViewing&formName',
            component: 'irfZimbabweComponent',
            params: {
                id: null
            }
        });
}

export default IrfZimbabweRoutes;
