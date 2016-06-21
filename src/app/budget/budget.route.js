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
            requireLogin: true
          }
        })
        .state('mdf', {
          url: '/budget/:id/mdf',
          templateUrl: 'app/budget/mdf/mdf.html',
          controller: 'MdfController',
          controllerAs: 'vm',
          data: {
            requireLogin: true
          }
        });
}

export default budgetRouteConfig;
