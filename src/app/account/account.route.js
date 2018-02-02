import accountTemplate from './account.html';
import './account.less';
import accountListTemplate from './components/list/accountList.html';
import './components/list/accountList.less';
import activateTemplate from './components/activate/activateAccount.html';
import controlTemplate from './components/control/accessControl.html';
import './components/control/accessControl.less';
import editTemplate from './components/edit/accountEdit.html';
import './components/edit/accountEdit.less';
import notFoundTemplate from './components/edit/accountNotFound.html';

function accountRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('accounts', {
            url: '/accounts',
            abstract: true,
            controller: 'AccountController',
            controllerAs: 'accountCtrl',
            templateUrl: accountTemplate,
        })
        .state('accounts.list', {
            url: '/list',
            controller: 'AccountListController',
            controllerAs: 'accountListCtrl',
            templateUrl: accountListTemplate,
            data: {
                index: 0,
            }
        })
        .state('accounts.control', {
            url: '/control?acState',
            params: {
                acState: { dynamic: true }
            },
            controller: 'AccessControlController',
            controllerAs: 'accessControlCtrl',
            templateUrl: controlTemplate,
            data: {
                index: 1,
            },
        })
        .state('account', {
            url: '/account/{id:[0-9]+|create}',
            controller: 'AccountEditController',
            controllerAs: 'accountEditCtrl',
            templateUrl: editTemplate,
        })

        .state('accountNotFound', {
            url: '/account/notfound',
            templateUrl: notFoundTemplate,
        })

        .state('account activate', {
            url: '/account/activate/:activation_key',
            templateUrl: activateTemplate,
            controller: 'ActivateAccountController',
            controllerAs: 'activateAcctCtrl'
        });
}

export default accountRouteConfig;
