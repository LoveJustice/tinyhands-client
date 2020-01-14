import MonthlyReportNepalComponent from './nepal.component';

import MonthlyReportNepalRoutes from './monthlyReport.nepal.route';

/* global angular */

export default angular.module('tinyhands.MonthlyReport.nepal', [])
    .config(MonthlyReportNepalRoutes)
    .component('monthlyReportNepalComponent', MonthlyReportNepalComponent)
    .name;