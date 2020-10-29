function IrfIndonesiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfIndonesia', {
            url: '/irf/indonesia:?id&stationId&countryId&isViewing&formName',
            component: 'irfIndonesiaComponent',
            params: {
                id: null
            }
        });
}

export default IrfIndonesiaRoutes;
