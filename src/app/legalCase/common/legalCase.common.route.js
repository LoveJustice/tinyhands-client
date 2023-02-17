function LegalCaseCommonRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('legalCaseCommon', {
            url: '/legalCase/common:?id&stationId&countryId&isViewing&formName&incidentId',
            component: 'legalCaseCommonComponent',
            params: {
                id: null
            }
        });
}

export default LegalCaseCommonRoutes;
