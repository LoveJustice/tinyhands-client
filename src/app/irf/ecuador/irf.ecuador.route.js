function IrfEcuadorRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfEcuador', {
            url: '/irf/ecuador:?id&stationId&countryId&isViewing&formName',
            component: 'irfEcuadorComponent',
            params: {
                id: null
            }
        });
}

export default IrfEcuadorRoutes;
