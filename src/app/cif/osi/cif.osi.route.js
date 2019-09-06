function CifOsiRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('cifOsi', {
            url: '/cif/osi:?id&stationId&countryId&isViewing&formName',
            component: 'cifOsiComponent',
            params: {
                id: null
            }
        });
}

export default CifOsiRoutes;
