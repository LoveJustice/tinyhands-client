function MsrCommonRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('msrCommon', {
            url: '/msr/common:?id&stationId&countryId&isViewing&formName',
            component: 'msrCommonComponent',
            params: {
                id: null
            }
        });
}

export default MsrCommonRoutes;
