import sharedModule from '../shared/shared.module';
import MonthlyReportIndiaModule from './india/monthlyReport.india.module';
import MonthlyReportNepalModule from './nepal/monthlyReport.nepal.module';

import MonthlyReportRoutes from './monthlyReport.route';
import MonthlyReportService from './monthlyReport.service';

import MonthlyReportListController from './list/monthlyReportList.controller';
import CreateMonthlyReportModalController from './list/createMonthlyReportModal.controller';

import MonthlyReportListService from './list/monthlyReportList.service';

/* global angular */

export default angular.module('tinyhands.MonthlyReport', [MonthlyReportIndiaModule, MonthlyReportNepalModule, sharedModule])
    .config(MonthlyReportRoutes)
    .controller('MonthlyReportListController', MonthlyReportListController)
    .service('MonthlyReportListService', MonthlyReportListService)
    .controller('CreateMonthlyReportModalController', CreateMonthlyReportModalController)
    .service('MonthlyReportService', MonthlyReportService)
    .name;
