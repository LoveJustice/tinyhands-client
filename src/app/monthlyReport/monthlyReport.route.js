import monthlyReportListTemplate from './list/monthlyReportList.html';
import monthlyReportSummaryTemplate from './summary/monthlyReportSummary.html';
import './list/monthlyReportList.less';

function MonthlyReportRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('monthlyReportList', {
      url: '/monthlyReport?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: monthlyReportListTemplate,
      controller: 'MonthlyReportListController',
      controllerAs: 'monthlyReportListCtrl',
    })
    .state('monthlyReportSummary', {
      url: '/monthlyReportSummary',
      params: {
      },
      templateUrl: monthlyReportSummaryTemplate,
      controller: 'MonthlyReportSummaryController',
      controllerAs: 'monthlyReportSummaryCtrl',
    });
}

export default MonthlyReportRoutes;