function MonthlyReportBangladeshRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('monthlyReportBangladesh', {
            url: '/monthlyReport/bangladesh:?id&stationId&countryId&isViewing&formName',
            component: 'monthlyReportBangladeshComponent',
            params: {
                id: null
            }
        });
}

export default MonthlyReportBangladeshRoutes;
