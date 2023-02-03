function IrfSfeNepalRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfSfeNepal', {
            url: '/irf/nepalSfe:?id&stationId&countryId&isViewing&formName',
            component: 'irfSfeNepalComponent',
            params: {
                id: null
            }
        });
}

export default IrfSfeNepalRoutes;