export default class AccountEditController {
  constructor($scope, $state, $window ,AccountService, PermissionsSetsService) {
    'ngInject';
    // Modules
    this.$scope = $scope;
    this.$state = $state;
    this.$window = $window;
    //Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;
    //Scope Variables
    this.emailError = '';
    this.userDesignationError = '';

    this.$window.scrollTo(0, 0);

    let accountOptionsPath = 'app/account/components/';
    this.sections = {allSections: [{ name: 'Accounts List', templateUrl: `${accountOptionsPath}list/accountList.html` },
                                   { name: 'Accounts Access Control', templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                   { name: 'Accounts Defaults', templateUrl: `${accountOptionsPath}defaults/accountDefaults.html`}]}

    if(this.$state.params.id != 'new' && this.$state.params.id > 0) {
          this.AccountService.getAccount(this.$state.params.id).then((result) => {
            this.account = result.data;
            this.editing = true;
            this.title = 'Edit ' +this.account.first_name + ' ' + this.account.last_name + "'s Account";
          });
    } else {
          this.editing = false;
          this.title = 'Create Account';
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
          this.$state.go("account", {activeTab: 0});
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

  onUserDesignationChanged(permissionSetId) {
    if (permissionSetId){
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