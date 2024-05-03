function IrfPhilippinesRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfPhilippines', {
            url: '/irf/philippines:?id&stationId&countryId&isViewing&formName',
            component: 'irfPhilippinesComponent',
            params: {
                id: null
            }
        });
}

export default IrfPhilippinesRoutes;