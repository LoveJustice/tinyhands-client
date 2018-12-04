function CifNepalRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('cifNepal', {
            url: '/cif/nepal:?id&stationId&countryId&isViewing&formName',
            component: 'cifNepalComponent',
            params: {
                id: null
            }
        });
}

export default CifNepalRoutes;
