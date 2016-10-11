function accountRouteConfig ($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
    .state('accounts', {
        url: '/accounts',
        abstract: true,
        controller: 'AccountController',
        controllerAs: 'accountCtrl',
        templateUrl: 'app/account/account.html',
        resolve: {
            requireLogin: RequireLogin
        }
    })
    .state('accounts.list', {
        url: '/list',
        controller: 'AccountListController',
        controllerAs: 'accountListCtrl',
        templateUrl: 'app/account/components/list/accountList.html',
        data: {
            index: 0,
        },
        resolve: {
            requireLogin: RequireLogin
        }
    })
    .state('accounts.control', {
        url: '/control',
        controller: 'AccessControlController',
        controllerAs: 'accessControlCtrl',
        templateUrl: 'app/account/components/control/accessControl.html',
        data: {
            index: 1,            
        },
        resolve: {
            requireLogin: RequireLogin
        }
    })
    .state('accounts.defaults', {
        url: '/defaults',
        controller: 'AccessDefaultsController',
        controllerAs: 'accessDefaultsCtrl',
        templateUrl: 'app/account/components/defaults/accessDefaults.html',
        data: {
            index: 2,
        },
        resolve: {
            requireLogin: RequireLogin
        }
    })
    .state('account', {
        url: '/account/{id:[0-9]+|create}',
        controller: 'AccountEditController',
        controllerAs: 'accountEditCtrl',
        templateUrl: 'app/account/components/edit/accountEdit.html',
        resolve: {
            requireLogin: RequireLogin
        }
    })

    .state('accountNotFound', {
        url: '/account/notfound',
        templateUrl: 'app/account/components/edit/accountNotFound.html',
        resolve: {
            requireLogin: RequireLogin
        }
    })

    .state('account activate', {
        url: '/account/activate/:activation_key',
        templateUrl: 'app/account/components/activate/activateAccount.html',
        controller: 'ActivateAccountController',
        controllerAs: 'activateAcctCtrl',
        resolve: {
            requireLogin: RequireLogin
        }
    });
}

export default accountRouteConfig;