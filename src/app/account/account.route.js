import accountTemplate from './account.html';
import './account.less';
import accountListTemplate from './components/list/accountList.html';
import './components/list/accountList.less';
import activateTemplate from './components/activate/activateAccount.html';
import controlTemplate from './components/control/accessControl.html';
import './components/control/accessControl.less';
import defaultsTemplate from './components/defaults/accessDefaults.html';
import './components/defaults/accessDefaults.less';
import editTemplate from './components/edit/accountEdit.html';
import './components/edit/accountEdit.less';
import notFoundTemplate from './components/edit/accountNotFound.html';

function accountRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('accounts', {
            url: '/accounts',
            abstract: true,
            controller: 'AccountController',
            controllerAs: 'accountCtrl',
            templateUrl: accountTemplate,
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('accounts.list', {
            url: '/list',
            controller: 'AccountListController',
            controllerAs: 'accountListCtrl',
            templateUrl: accountListTemplate,
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
            templateUrl: controlTemplate,
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
            templateUrl: defaultsTemplate,
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
            templateUrl: editTemplate,
            resolve: {
                requireLogin: RequireLogin
            }
        })

        .state('accountNotFound', {
            url: '/account/notfound',
            templateUrl: notFoundTemplate,
            resolve: {
                requireLogin: RequireLogin
            }
        })

        .state('account activate', {
            url: '/account/activate/:activation_key',
            templateUrl: activateTemplate,
            controller: 'ActivateAccountController',
            controllerAs: 'activateAcctCtrl'
        });
}

export default accountRouteConfig;
