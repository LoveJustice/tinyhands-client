function IrfEthiopiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfEthiopia', {
            url: '/irf/ethiopia:?id&stationId&countryId&isViewing&formName',
            component: 'irfEthiopiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfEthiopiaRoutes;
