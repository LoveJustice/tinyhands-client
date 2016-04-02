export default class AccountEditController {
  constructor($q, $scope, $timeout, $uibModal, $state, $window, AccountService, PermissionsSetsService) {
    'ngInject';
    // Modules
    this.$scope = $scope;
    this.$window = $window;
    //Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;

    //Scope Variables
    this.emailError = '';
    this.userDesignationError = '';

    if(this.$scope.accountToEdit.id != undefined && this.$scope.accountToEdit.id > -1) {
          this.editing = true;
          this.account = this.$scope.accountToEdit;
    } else {
          this.editing = false;
          this.account = {
              email: '',
              first_name: '',
              last_name: '',
              user_designation: '',
              permission_irf_view: false,
              permission_irf_add: false,
              permission_irf_edit: false,
              permission_irf_delete: false,
              permission_vif_view: false,
              permission_vif_add: false,
              permission_vif_edit: false,
              permission_vif_delete: false,
              permission_border_stations_view: false,
              permission_border_stations_add: false,
              permission_border_stations_edit: false,
              permission_border_stations_delete: false,
              permission_accounts_manage: false,
              permission_receive_email: false,
              permission_address2_manage: false,
              permission_budget_manage: false,
          }
    }

    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissionsSets = result.data.results;
    });


  }

  update() {
      if(!this.checkFields()){
          return;
      }
      var call;
      if(this.editing) {
          call = this.AccountService.update(this.account.id, this.account);
      }else {
          call= this.AccountService.create(this.account);
      }
      call.then(() => {
          this.$window.location.href = "/account";
      }, (err) => {
          if(err.data.email){
              this.emailError = err.data.email[0];
          }
      });
  }

  checkFields() {
      this.emailError = '';
      this.userDesignationError = '';
      if(!this.account.email) {
          this.emailError = 'An email is required.';
      }
      if(!this.account.user_designation){
          this.userDesignationError = 'A user designation is required.';
      }
      if(this.emailError || this.userDesignationError) {
          return false;
      }
      return true;
  }

  getTitle() {
      if(this.editing) {
          return 'Edit ' +this.account.first_name + ' ' + this.account.last_name + "'s Account";
      }
      return 'Create Account';
  }

  onUserDesignationChanged(permissionSetId) {
     this.PermissionsSetsService.getPermission(permissionSetId).then((permissions) => {
          this.account.permission_irf_view = permissions.data.permission_irf_view;
          this.account.permission_irf_add = permissions.data.permission_irf_add;
          this.account.permission_irf_edit = permissions.data.permission_irf_edit;
          this.account.permission_irf_delete = permissions.data.permission_irf_delete;
          this.account.permission_vif_view = permissions.data.permission_vif_view;
          this.account.permission_vif_add = permissions.data.permission_vif_add;
          this.account.permission_vif_edit = permissions.data.permission_vif_edit;
          this.account.permission_vif_delete = permissions.data.permission_vif_delete;
          this.account.permission_border_stations_view = permissions.data.permission_border_stations_view;
          this.account.permission_border_stations_add = permissions.data.permission_border_stations_add;
          this.account.permission_border_stations_edit = permissions.data.permission_border_stations_edit;
          this.account.permission_border_stations_delete = permissions.data.permission_border_stations_delete;
          this.account.permission_accounts_manage = permissions.data.permission_accounts_manage;
          this.account.permission_receive_email = permissions.data.permission_receive_email;
          this.account.permission_address2_manage = permissions.data.permission_address2_manage;
          this.account.permission_budget_manage = permissions.data.permission_budget_manage;
      });
  }

  getButtonText(has_permission) {
            if(has_permission) {
                return "Yes";
            }
            return "No";
        }

  getUpdateButtonText() {
      if(this.editing) {
          return "Update";
      }
      return "Create";
  }
}