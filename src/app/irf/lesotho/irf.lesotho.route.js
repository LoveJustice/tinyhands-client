function IrfLesothoRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfLesotho', {
            url: '/irf/lesotho:?id&stationId&countryId&isViewing&formName',
            component: 'irfLesothoComponent',
            params: {
                id: null
            }
        });
}

export default IrfLesothoRoutes;
