export default class AccountControlController {

  constructor($q, $scope, $state, $timeout, $uibModal, $window, AccountService, PermissionsSetsService) {
    'ngInject';

    // Modules
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$window = $window;
    // Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;

    // Scope Variables
    this.saveButtonInfo = {"saveButtonText": "Saved", "saveButtonColor": "btn-primary", "unsavedChanges": false};
    this.accounts = {};
    this.permissions = {};

    this.AccountService.getAccounts().then((result) => {
      this.accounts.local = result.data;
      this.accounts.saved = angular.copy(this.accounts.local);
    });
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissions = result.data.results;
    });

    this.$scope.$watch( () => this.saveButtonInfo.unsavedChanges, (newValue)=>{
      this.$scope.tabInfo.unsavedChanges = newValue;
    });

    this.$scope.$on('getSaveAllParameters', () => {
      this.updateSaveInfo(true);
    });
    this.$scope.$on('getDiscardChangesParameters', () => {
      this.updateSaveInfo(false);
    });
  }

  updateSaveInfo(saveAll) {
    this.$scope.saveInfo.arrays = this.accounts;
    this.$scope.saveInfo.saveButtonInfo = this.saveButtonInfo;
    this.$scope.saveInfo.serviceToUse = this.AccountService;
    this.$scope.saveInfo.saveAll = saveAll;
  }
  changeUserRole(account) {
      this.PermissionsSetsService.getPermission(account.user_designation).then((result) => {
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
}

