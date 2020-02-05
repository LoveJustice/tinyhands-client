function CifIndiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('cifIndia', {
            url: '/cif/india:?id&stationId&countryId&isViewing&formName',
            component: 'cifIndiaComponent',
            params: {
                id: null
            }
        })
        .state('cifIndiaNetwork', {
            url: '/cif/indiaNetwork:?id&stationId&countryId&isViewing&formName',
            component: 'cifIndiaComponent',
            params: {
                id: null
            }
        });
}

export default CifIndiaRoutes;
