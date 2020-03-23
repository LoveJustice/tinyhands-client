function IrfIndiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfIndia', {
            url: '/irf/india:?id&stationId&countryId&isViewing&formName',
            component: 'irfIndiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfIndiaRoutes;
