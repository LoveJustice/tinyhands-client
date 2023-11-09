import budgetTemplate from './form/budget.html?url';
import './form/budget.less';
import budgetListTemplate from './list/budgetList.html?url';
import mdfTemplate from './mdf/mdf.html?url';
import './mdf/mdf.less';
import './list/budgetList.less';

function budgetRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('budget', {
            url: '/budget/:id?borderStationId&isViewing',
            templateUrl: budgetTemplate,
            controller: 'BudgetController',
            controllerAs: 'budgetCtrl',
            params: {
                id: null
            }
        })
        .state('budgetList', {
            url: '/budget?search&countryIds',
            params: {
                search: { dynamic: true },
                countryIds: { dynamic: true }
            },
            templateUrl: budgetListTemplate,
            controller: 'BudgetListController',
            controllerAs: 'budgetListCtrl',
        })
        .state('mdf', {
            url: '/budget/:id/mdf?mdf_type',
            templateUrl: mdfTemplate,
            controller: 'MdfController',
            controllerAs: 'vm',
        });
}

export default budgetRouteConfig;
