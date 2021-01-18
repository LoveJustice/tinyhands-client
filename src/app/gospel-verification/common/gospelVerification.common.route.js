function GospelVerificationCommonRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('gospelVerification', {
            url: '/gospel-verification/common:?id&vdf_id&stationId&countryId&isViewing&formName',
            component: 'gospelVerificationCommonComponent',
            params: {
                id: null
            }
        });
}

export default GospelVerificationCommonRoutes;
