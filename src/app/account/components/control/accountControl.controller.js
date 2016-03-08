export default class AccountControlController {

  constructor($q, $scope, $timeout, $window, AccountService, PermissionsSetsService, AccountUtilities) {
    'ngInject';

    // Modules
    this.$scope = $scope;
    this.$window = $window;
    this.$q = $q;
    this.$timeout = $timeout;

    // Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;

    // Scope Variables
    this.saveButtonText = this.savedText;
    this.saveButtonColor = this.savedColor;
    this.unsavedChanges = false;
    this.permissionsSets = {};
    this.savedPermissionsSets = {};

    this.activate();
  }

  activate() {
    this.AccountService.getAccounts().then((result) => {
      this.accounts = result.data;
    });
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissionsSets = result.data;
      this.savedPermissionsSets = angular.copy(this.permissionsSets);
    });
  }

  changeUserRole(account) {
      console.log(account.user_designation);
      this.PermissionsSetsService.getPermission(account.user_designation).then((result) => {
          console.log(result);
          account.permission_irf_view =  result.data.permission_irf_view;
          account.permission_irf_add = result.data.permission_irf_add;
          account.permission_irf_edit = result.data.permission_irf_edit;
          account.permission_irf_delete = result.data.permission_irf_delete;
          account.permission_vif_view = result.data.permission_vif_view;
          account.permission_vif_add = result.data.permission_vif_add;
          account.permission_vif_edit = result.data.permission_vif_edit;
          account.permission_vif_delete = result.data.permission_vif_delete;
          account.permission_border_stations_view = result.data.permission_border_stations_view;
          account.permission_border_stations_add = result.data.permission_border_stations_add;
          account.permission_border_stations_edit = result.data.permission_border_stations_edit;
          account.permission_border_stations_delete = result.data.permission_border_stations_delete;
          account.permission_accounts_manage = result.data.permission_accounts_manage;
          account.permission_receive_email = result.data.permission_receive_email;
          account.permission_vdc_manage = result.data.permission_vdc_manage;
          account.permission_budget_manage = result.data.permission_budget_manage;
      });
  }

  toggleModified(index) {
    AccountUtilities.toggleModified(index)
  }

  saveAll() {
    this.updateSaveButton(this.savingText, this.savingColor)
    return this.$q((resolve, reject) => {
        var promises = [];
        this.accounts.forEach((elm, idx) => {
            promises.push(this.AccountService.update(this.accounts[idx].id, this.accounts[idx]));
        });
        this.$q.all(promises).then(() => {
            this.updateSaveButton(this.savedText, this.savedColor, 800)
        });
    });
  }

  updateSaveButton(text, color, time) {
    this.$timeout(() => {
      this.saveButtonText = text;
      this.saveButtonColor = color;
    }, time);
  }

}

