function MonthlyReportNepalRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('monthlyReportNepal', {
            url: '/monthlyReport/nepal:?id&stationId&countryId&isViewing&formName',
            component: 'monthlyReportNepalComponent',
            params: {
                id: null
            }
        });
}

export default MonthlyReportNepalRoutes;
