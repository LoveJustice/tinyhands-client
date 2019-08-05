import MonthlyReportIndiaComponent from './india.component';

import MonthlyReportIndiaRoutes from './monthlyReport.india.route';

/* global angular */

export default angular.module('tinyhands.MonthlyReport.india', [])
    .config(MonthlyReportIndiaRoutes)
    .component('monthlyReportIndiaComponent', MonthlyReportIndiaComponent)
    .name;