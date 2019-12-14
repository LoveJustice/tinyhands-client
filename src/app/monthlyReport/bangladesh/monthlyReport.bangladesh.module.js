import MonthlyReportBangladeshComponent from './bangladesh.component';

import MonthlyReportBangladeshRoutes from './monthlyReport.bangladesh.route';

/* global angular */

export default angular.module('tinyhands.MonthlyReport.bangladesh', [])
    .config(MonthlyReportBangladeshRoutes)
    .component('monthlyReportBangladeshComponent', MonthlyReportBangladeshComponent)
    .name;