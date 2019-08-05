function IrfSierraLeoneRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfSierraLeone', {
            url: '/irf/sierraLeone:?id&stationId&countryId&isViewing&formName',
            component: 'irfSierraLeoneComponent',
            params: {
                id: null
            }
        });
}

export default IrfSierraLeoneRoutes;
