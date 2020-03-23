function IrfIndiaNetworkRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfIndiaNetwork', {
            url: '/irf/indiaNetwork:?id&stationId&countryId&isViewing&formName',
            component: 'irfIndiaNetworkComponent',
            params: {
                id: null
            }
        });
}

export default IrfIndiaNetworkRoutes;
