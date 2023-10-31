import accountTemplate from './account.html?url';
import './account.less';
import accountListTemplate from './components/list/accountList.html?url';
import './components/list/accountList.less';
import activateTemplate from './components/activate/activateAccount.html?url';
import controlTemplate from './components/control/accessControl.html?url';
import './components/control/accessControl.less';
import editTemplate from './components/edit/accountEdit.html?url';
import './components/edit/accountEdit.less';
import notFoundTemplate from './components/edit/accountNotFound.html?url';

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
            controllerAs: 'activateAcctCtrl',
            data: {
                loginNotRequired: true
            }
        });
}

export default accountRouteConfig;
