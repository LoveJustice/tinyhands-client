import budgetTemplate from './form/budget.html';
import './form/budget.less';
import budgetListTemplate from './list/budgetList.html';
import mdfTemplate from './mdf/mdf.html'
import './mdf/mdf.less';

function budgetRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('budget', {
            url: '/budget/:id?borderStationId&isViewing',
            templateUrl: budgetTemplate,
            controller: 'BudgetController',
            controllerAs: 'budgetCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('budgetList', {
            url: '/budget',
            templateUrl: budgetListTemplate,
            controller: 'BudgetListController',
            controllerAs: 'budgetListCtrl',
            data: {
                permissions_required: ['permission_budget_view']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('mdf', {
            url: '/budget/:id/mdf',
            templateUrl: mdfTemplate,
            controller: 'MdfController',
            controllerAs: 'vm',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default budgetRouteConfig;
