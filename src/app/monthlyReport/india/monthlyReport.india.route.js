function MonthlyReportIndiaRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('monthlyReportIndia', {
            url: '/monthlyReport/india:?id&stationId&countryId&isViewing&formName',
            component: 'monthlyReportIndiaComponent',
            params: {
                id: null
            }
        });
}

export default MonthlyReportIndiaRoutes;
