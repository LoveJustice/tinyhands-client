function CifSouthAfricaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('cifSouthAfrica', {
            url: '/cif/southAfrica:?id&stationId&countryId&isViewing&formName',
            component: 'cifSouthAfricaComponent',
            params: {
                id: null
            }
        });
}

export default CifSouthAfricaRoutes;
