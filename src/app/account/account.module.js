import accountRouteConfig from './account.route';

import ActivateAccountController from './components/activate/activateAccount.controller';
import AccountController from './account.controller';
import AccountListController from './components/list/accountList.controller';
import AccessControlController from './components/control/accessControl.controller';
import AccessDefaultsController from './components/defaults/accessDefaults.controller';
import AccountEditController from './components/edit/accountEdit.controller';
import UnsavedChangesModalController from './components/modal/unsavedChangesModal.controller';

import ConfirmButton from './components/confirmButton/confirmButton.directive';

import AccountService from './account.service';
import PermissionsSetsService from './permissionsSets.service';

export default angular.module('tinyhands.Account', ['ui.router', 'tinyhands.Shared'])
    .config(accountRouteConfig)

    .controller('ActivateAccountController', ActivateAccountController)
    .controller('AccountController', AccountController)
    .controller('AccountListController', AccountListController)
    .controller('AccessControlController', AccessControlController)
    .controller('AccessDefaultsController', AccessDefaultsController)
    .controller('AccountEditController', AccountEditController)
    .controller('UnsavedChangesModalController', UnsavedChangesModalController)
    
    .directive('confirmButton', ConfirmButton)

    .service('AccountService', AccountService)
    .service('PermissionsSetsService', PermissionsSetsService);
