export default class AccountControlController {

  constructor($scope, $window, AccountService, PermissionsSetsService) {
    'ngInject';

    // Modules
    this.$scope = $scope;
    this.$window = $window;
    // Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;
    // Scope Variables

    this.activate;
  }

  activate() {
    this.emailError = '';
    this.userDesignationError = '';

    if(this.$window.account_id !== undefined && $window.account_id > -1) {
        this.editing = true;
        var accountId = this.$window.account_id;
        this.AccountsService.get(accountId).then((result) => {
          this.account = result.data;
        });
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
            permission_vdc_manage: false,
            permission_budget_manage: false,
        }
    }

    vm.permissionsSets = PermissionsSets.all();
  }
}



        vm.update = function() {
            if(!vm.checkFields()){
                return;
            }
            var call;
            if(vm.editing) {
                call = Accounts.update(vm.account).$promise;
            }else {
                call= Accounts.create(vm.account).$promise;
            }
            call.then(function() {
                $window.location.href = "/accounts";
            }, function(err) {
                if(err.data.email){
                    vm.emailError = err.data.email[0];
                }
            });
        }

        vm.checkFields = function() {
            vm.emailError = '';
            vm.userDesignationError = '';
            if(!vm.account.email) {
                vm.emailError = 'An email is required.';
            }
            if(!vm.account.user_designation){
                vm.userDesignationError = 'A user designation is required.';
            }
            if(vm.emailError || vm.userDesignationError) {
                return false;
            }
            return true;
        }

        vm.getTitle = function() {
            if(vm.editing) {
                return 'Edit ' +vm.account.first_name + ' ' + vm.account.last_name + "'s Account";
            }
            return 'Create Account';
        }

        vm.onUserDesignationChanged = function(permissionSetId) {
            PermissionsSets.get({id: permissionSetId}).$promise.then(function (permissions) {
                vm.account.permission_irf_view = permissions.permission_irf_view;
                vm.account.permission_irf_add = permissions.permission_irf_add;
                vm.account.permission_irf_edit = permissions.permission_irf_edit;
                vm.account.permission_irf_delete = permissions.permission_irf_delete;
                vm.account.permission_vif_view = permissions.permission_vif_view;
                vm.account.permission_vif_add = permissions.permission_vif_add;
                vm.account.permission_vif_edit = permissions.permission_vif_edit;
                vm.account.permission_vif_delete = permissions.permission_vif_delete;
                vm.account.permission_border_stations_view = permissions.permission_border_stations_view;
                vm.account.permission_border_stations_add = permissions.permission_border_stations_add;
                vm.account.permission_border_stations_edit = permissions.permission_border_stations_edit;
                vm.account.permission_border_stations_delete = permissions.permission_border_stations_delete;
                vm.account.permission_accounts_manage = permissions.permission_accounts_manage;
                vm.account.permission_receive_email = permissions.permission_receive_email;
                vm.account.permission_vdc_manage = permissions.permission_vdc_manage;
                vm.account.permission_budget_manage = permissions.permission_budget_manage;
            });
        }

        vm.getButtonText = function(has_permission) {
            if(has_permission) {
                return "Yes";
            }
            return "No";
        }

        vm.getUpdateButtonText = function() {
            if(vm.editing) {
                return "Update";
            }
            return "Create";
        }

        vm.activate();
    }
