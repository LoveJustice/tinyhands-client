function IrfArgentinaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfArgentina', {
            url: '/irf/argentina:?id&stationId&countryId&isViewing&formName',
            component: 'irfArgentinaComponent',
            params: {
                id: null
            }
        });
}

export default IrfArgentinaRoutes;