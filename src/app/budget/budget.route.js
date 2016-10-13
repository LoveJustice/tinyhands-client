function budgetRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('budget', {
            url: '/budget/:id?borderStationId&isViewing',
            templateUrl: 'app/budget/form/budget.html',
            controller: 'BudgetController',
            controllerAs: 'budgetCtrl',
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('budgetList', {
            url: '/budget',
            templateUrl: 'app/budget/list/budgetList.html',
            controller: 'BudgetListController',
            controllerAs: 'budgetListCtrl',
            data: {
                permissions_required: ['permission_budget_manage']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('mdf', {
            url: '/budget/:id/mdf',
            templateUrl: 'app/budget/mdf/mdf.html',
            controller: 'MdfController',
            controllerAs: 'vm',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default budgetRouteConfig;
