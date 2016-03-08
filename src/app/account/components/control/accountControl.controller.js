export default class AccountControlController {

  constructor($q, $state, $uibModal, $scope, $timeout, $window, AccountService, PermissionsSetsService) {
    'ngInject';

    // Modules
    this.$scope = $scope;
    this.$window = $window;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$state = $state;
    this.$uibModal = $uibModal;
    // Services
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;

    // Scope Variables
    this.saveText= "Save All";
    this.savingText = "Saving...";
    this.savedText = "Saved";
    this.saveColor = "btn-success";
    this.savingColor = "btn-success";
    this.savedColor = "btn-primary";
    this.saveButtonText = this.savedText;
    this.saveButtonColor = this.savedColor;
    this.unsavedChanges = false;
    this.accounts = [];
    this.savedAccounts = [];

    this.createListener();
    this.activate();
  }
  createListener() {
    this.$scope.$on('$stateChangeStart', (e, toState, toParams, fromState, fromParams) => {
      if(this.unsavedChanges) {
        e.preventDefault();
        this.openUnsavedChangesModal(toState.name);
      }
    });
  }

  activate() {
    this.AccountService.getAccounts().then((result) => {
      this.accounts = result.data;
      this.savedAccounts = angular.copy(this.accounts);
    });
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissionsSets = result.data;
    });
  }

  changeUserRole(account) {
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

  updateSaveButton(text, color, time) {
    this.$timeout(() => {
      this.saveButtonText = text;
      this.saveButtonColor = color;
    }, time);
  }

  toggleModified(index) {
    // Checks if pSet is new. If it is, there is no need to check if it has been modified.
    var modified = false;
    var keys = Object.keys(this.accounts[index]);
    keys.forEach((key) => {
      // Checks if a permission value on local copy differs from a permission value in database
      // Ignores '$$hashKey' key, which angular adds when copying an object.
      // It also ignores 'is_modified', since savedPermissionsSets does not have that property.
      if (key != '$$hashKey' && key != 'is_modified' && this.accounts[index][key] != this.savedAccounts[index][key]) {
        modified = true;
      }
    });
    if (modified){
      this.accounts[index].is_modified = true;
    } else {
      this.accounts[index].is_modified = false;
    }
    this.checkForUnsavedChanges();
  }

  checkForUnsavedChanges() {
    var unsaved = false;
    this.accounts.forEach((account) => {
      if (account.is_modified) { unsaved = true; return;}
    });

    if (unsaved){
        this.updateSaveButton(this.saveText, this.saveColor);
        this.unsavedChanges = true;
    } else {
        this.updateSaveButton(this.savedText, this.savedColor);
        this.unsavedChanges = false;
    }
  }

  saveAll() {
    this.updateSaveButton(this.savingText, this.savingColor)
    return this.$q((resolve, reject) => {
        var promises = [];
        this.accounts.forEach((elm, index) => {
            promises.push(this.saveSet(index));
        });
        this.$q.all(promises).then(() => {
            console.log("done");
            this.savedAccounts = angular.copy(this.accounts);
            this.$timeout(() => {
              this.updateSaveButton(this.savedText, this.savedColor, 0);
              this.unsavedChanges = false;
              resolve();
            }, 800);
        });
    });
  }

  saveSet(index) {
      var call = null;
      var account = this.accounts[index];
      return this.$q((resolve, reject) => {
        if (account.is_modified) {
            call = this.AccountService.update(this.accounts[index].id, this.accounts[index])
        } else {
            resolve("no need to re-save");
            return;
        }
        call.then( (data) => {
            this.accounts[index] = data.data;
            resolve("successfully saved");
        }, (error) => { // Catch name error
            reject("error");
        });
      });
  }

  openUnsavedChangesModal(toStateName) {
    var selection = this.$uibModal.open({
      templateUrl:'app/account/components/defaults/unsavedChangesModal.html',
      controller: 'UnsavedChangesModalController',
      controllerAs: 'UnsavedChangesModalCtrl'
    });
    selection.result.then((result) => {
      if (result == 'save') {
          var promise = this.saveAll();
          //Beginning of promise chain (saveAll() => saveSet())
          //If saving was successful, redirect to desired page.
          promise.then((reason) => {
            this.$state.go(toStateName);
          });
      } else {
          this.discardChanges()
          this.$state.go(toStateName);
      }
    });
  }

  discardChanges() {
    this.accounts = angular.copy(this.savedAccounts);
    this.updateSaveButton(this.savedText, this.savedColor);
    this.unsavedChanges = false;
  }

}

