function IrfNepalRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfNepal', {
            url: '/irf/nepal:?id&stationId&countryId&isViewing&formName',
            component: 'irfNepalComponent',
            params: {
                id: null
            }
        });
}

export default IrfNepalRoutes;