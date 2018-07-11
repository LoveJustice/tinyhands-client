function IrfSouthAfricaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfSouthAfrica', {
            url: '/irf/southAfrica:id?stationId&countryId&isViewing',
            component: 'irfSouthAfricaComponent',
            params: {
                id: null
            }
        });
}

export default IrfSouthAfricaRoutes;