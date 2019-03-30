function VdfNepalRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('vdfNepal', {
            url: '/vdf/nepal:?id&stationId&countryId&isViewing&formName',
            component: 'vdfNepalComponent',
            params: {
                id: null
            }
        });
}

export default VdfNepalRoutes;
