export default class AccountDefaultsController {

  constructor($q, $scope, $state, $timeout, $uibModal, AccountService, PermissionsSetsService) {
    'ngInject';

    // Modules
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;

    // Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;
    // Scope Variables
    this.permissions = {}
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissions.local = result.data.results;
      // Creates a deep copy of permissionsSets
      this.permissions.saved = angular.copy(this.permissions.local);
      // permissions.local is compared against permissions.saved to check for unsaved changes.
    });

    this.$scope.$on('getSaveAllParameters', (event, name) => {
      this.updateSaveInfo(true, name);
    });
    this.$scope.$on('getDiscardChangesParameters', (event, name) => {
      this.updateSaveInfo(false, name);
    });

    this.$scope.$watchCollection(() => this.permissions, (newValue, oldValue)=> {
        this.permissions = newValue;
      }, true);

  }

  updateSaveInfo(saveAll, name) {
    if (name == 'Accounts Defaults'){
      this.$scope.saveInfo.arrays = this.permissions;
      this.$scope.saveInfo.serviceToUse = this.PermissionsSetsService;
      this.$scope.saveInfo.saveAll = saveAll;
    }
  }

  addAnother() {
    this.permissions.local.push({
      is_new: true,
      is_used_by_accounts: false,
      name: "",
      permission_accounts_manage: false,
      permission_border_stations_add: false,
      permission_border_stations_delete: false,
      permission_border_stations_edit: false,
      permission_border_stations_view: false,
      permission_budget_manage: false,
      permission_irf_add: false,
      permission_irf_delete: false,
      permission_irf_edit: false,
      permission_irf_view: false,
      permission_receive_email: false,
      permission_vdc_manage: false,
      permission_vif_add: false,
      permission_vif_delete: false,
      permission_vif_edit: false,
      permission_vif_view: false
    });
    this.$scope.$emit('checkForUnsavedChange()', this.permissions);
  }

  delete(index) {
    var pSet = this.permissions.local[index];
    if (!pSet.is_used_by_accounts){
      if(pSet.accountRemoved){
        if (pSet.is_new) {
            // Local delete
          window.toastr.success("Account Role Successfully Deleted");
          this.permissions.local.splice(index, 1);
          this.$scope.$emit('checkForUnsavedChange()', this.permissions);
        } else {
            // Database delete
            this.permissions.local.splice(index, 1);
            this.PermissionsSetsService.destroy(pSet.id).then(() => {
                window.toastr.success("Account Role Successfully Deleted");
                this.permissions.saved = angular.copy(this.permissions.local);
                this.$scope.$emit('checkForUnsavedChange()', this.permissions);

            });
        }
      }
      else{
        pSet.accountRemoved = true;
      }
    }
  }
}

/*
  openDeleteModal(pSet, index) {
    var user_name = pSet.name;
    var deleteModal = this.$uibModal.open({
      templateUrl:'app/account/components/list/accountModal.html',
      controller: 'AccountModalController',
      controllerAs: 'AccountModalCtrl',
      resolve: {
        user_name:() => {
          return user_name;
        }
      }
    });
    deleteModal.result.then(() => {
        if (pSet.is_new) {
            // Local delete
            this.permissions.local.splice(index, 1);
            this.$scope.$emit('checkForUnsavedChange()', this.permissions);
        } else {
            // Database delete
            this.permissions.local.splice(index, 1);
            this.PermissionsSetsService.destroy(pSet.id).then(() => {
              this.permissions.saved = angular.copy(this.permissions.local);
              this.$scope.$emit('checkForUnsavedChange()', [this.permissions, this.saveButtonInfo]);
            })
        }
    });
  }*/

