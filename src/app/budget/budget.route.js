function budgetRouteConfig ($stateProvider) {
    'ngInject';
    $stateProvider
        .state('budget', {
          url: '/budget/:id?borderStationId&isViewing',
          templateUrl: 'app/budget/form/budget.html',
          controller: 'BudgetController',
          controllerAs: 'budgetCtrl',
          data: {
            requireLogin: true
          }
        })
        .state('budgetList', {
          url: '/budget',
          templateUrl: 'app/budget/list/budgetList.html',
          controller: 'BudgetListController',
          controllerAs: 'budgetListCtrl',
          data: {
            requireLogin: true,
            permissions_required: ['permission_budget_manage']
          }
        });
}

export default budgetRouteConfig;
