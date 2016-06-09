import accountRouteConfig from './account.route';

import ActivateAccountController from './components/activate/activateAccount.controller';
import AccountController from './account.controller';
import UnsavedChangesModalController from './components/modal/unsavedChangesModal.controller';

import AccountService from './account.service';
import PermissionsSetsService from './permissionsSets.service';

export default angular.module('tinyhands.Account', ['ui.router', 'tinyhands.Shared'])
    .config(accountRouteConfig)

    .controller('ActivateAccountController', ActivateAccountController)
    .controller('AccountController', AccountController)
    .controller('UnsavedChangesModalController', UnsavedChangesModalController)

    .service('AccountService', AccountService)
    .service('PermissionsSetsService', PermissionsSetsService);
