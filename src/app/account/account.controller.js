export default class AccountController {
  constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService) {
    'ngInject';
    // Modules
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.AccountService = AccountService;
    this.PermissionsSetsService = PermissionsSetsService;

    //If changing tab names or order, go to the
    // 'openUnsavedChangesModal' method and make sure it is saving the correct arrays.
    this.tab_1_name = 'Accounts List';
    this.tab_2_name = 'Accounts Access Control';
    this.tab_3_name = 'Accounts Defaults'

    //Scope variables
    let accountOptionsPath = 'app/account/components/';
    this.editAccountPath = `${accountOptionsPath}edit/accountEdit.html`;
    this.accountNotFoundPath = `${accountOptionsPath}edit/accountNotFound.html`;

    this.sections = {allSections: [{ name: this.tab_1_name , templateUrl: `${accountOptionsPath}list/accountList.html` },
                                   { name: this.tab_2_name , templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                   { name: this.tab_3_name , templateUrl: `${accountOptionsPath}defaults/accountDefaults.html`}]}

    //Stores information about the 'active' tab selected, as well as the current html template to display.
    this.tabInfo = {'active': null, 'sectionTemplateUrl': null};

    this.saveText= "Save All";
    this.savingText = "Saving...";
    this.savedText = "Saved";
    this.saveColor = "btn-success";
    this.savingColor = "btn-success";
    this.savedColor = "btn-primary";
    this.createText = "Create";
    this.updateText = "Update";
    this.creatingText = "Creating...";
    this.updatingText = "Updating...";
    this.inputColor = "btn-primary";
    this.updatingOrCreatingColor = "btn-success";
    this.saveButtonInfo = {"saveButtonText": this.savedText, "saveButtonColor": this.savedColor, "unsavedChanges": false};
    this.accountButtonInfo = {"accountButtonText": "", accountButtonColor: this.inputColor};

    this.accounts = {};
    this.permissions = {};

    //Used by 'Account List' tab
    this.AccountService.getMe().then((response) => {
      this.currentuser = response.data;
    });

    //Used by 'Account List' and 'Account Access Controls' tabs
    this.AccountService.getAccounts().then((result) => {
      this.accounts.local = result.data;
      // Creates a deep copy of accounts.local
      this.accounts.saved = angular.copy(this.accounts.local);
      // accounts.local is compared against accounts.saved to check for unsaved changes.
    });

    //Used by 'Account List' and 'Account Access Controls' and 'Account Defaults' tabs
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissions.local = result.data.results;
      // Creates a deep copy of permissions.local
      this.permissions.saved = angular.copy(this.permissions.local);
      // permissions.local is compared against permissions.saved to check for unsaved changes.
    });

    //Prevents changing states if unsaved changes
    this.$scope.$on('$stateChangeStart', (e, toState) => {
      if (this.saveButtonInfo.unsavedChanges) {
        e.preventDefault();
        this.openUnsavedChangesModal(0, toState.name);
      }
    });

    /*  This checks the URL params to see if a userId is present,
     *  if it is it opens the editUser tab. If no userId is present,
     *  it opens the activeTab specified in the URL. If the active Tab
     *  is not given, it defaults to 0, which is the 'Account List Tab'
     */
    if (this.$state.params.id) {
      if (this.$state.params.id == 'create') {
        this.accountCreate();
      } else {
        this.retrieveAccount(this.$state.params.id);
      }
    } else if (this.$state.params.activeTab == undefined) {
        this.$state.params.activeTab = 0;
    } else {
        this.switchActive(this.$state.params.activeTab);
    }
  }

  switchActive(index){
    if (this.saveButtonInfo.unsavedChanges == true) {
        this.openUnsavedChangesModal(index);
    } else {
        this.activateTab(index);
    }
  }

  activateTab(index){
    this.tabInfo.active = index;
    this.tabInfo.sectionTemplateUrl = this.sections.allSections[index].templateUrl;
    this.$state.transitionTo('account', {activeTab: index}, {
    location: true,
    inherit: true,
    relative: this.$state.$current,
    notify: false
    });
  }

  retrieveAccount(id){
    this.AccountService.getAccount(id).then((result) => {
      this.accountEdit(result.data)
    }, (error) => {
        if (error.status == 404){
          this.accountNotFound(id);
        }
    });
  }

  accountEdit(account) {
    this.tabInfo.active = -1; //Causes no nav-bar tab to be selected
    this.tabInfo.sectionTemplateUrl = this.editAccountPath;

    this.account = account;
    this.editing = true;
    this.resetErrors();
    this.getUpdateButtonText();
    this.title = 'Edit ' +this.account.first_name + ' ' + this.account.last_name + "'s Account";

    //Change to the Edit User State
    this.$state.transitionTo('account/:id', {id: this.account.id}, {
    location: true,
    inherit: true,
    relative: this.$state.$current,
    notify: false
    });
  }

  accountCreate(){
    this.tabInfo.active = -1; //Causes no nav-bar tab to be selected
    this.tabInfo.sectionTemplateUrl = this.editAccountPath;

    this.editing = false;
    this.resetErrors();
    this.getUpdateButtonText();
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

    //Change to the Edit User State
    this.$state.transitionTo('account/:id', {id: 'create'}, {
    location: true,
    inherit: true,
    relative: this.$state.$current,
    notify: false
    });
  }

  accountNotFound(id){
    this.idNotFound = id;
    this.tabInfo.active = -1; //Causes no nav-bar tab to be selected
    this.tabInfo.sectionTemplateUrl = this.accountNotFoundPath;
  }

  //This method is used to save the account and permissions arrays
  saveAll(arrays, serviceToUse) {
    this.updateSaveButton(this.savingText, this.savingColor, true);
    return this.$q((resolve, reject) => {
      var promises = [];
      arrays.local.forEach((elm, index) => {
        promises.push(this.saveSet(index, arrays.local, serviceToUse));
      });

      // Waiting for all permissionsSets to be saved via saveSet()
      this.$q.all(promises).then((data) => {
          arrays.saved = angular.copy(arrays.local);
          this.updateSaveButton(this.savedText, this.savedColor, false, 800);
          resolve();
      }, (error) => {
            this.PermissionsSetsService.getPermissions().then((result) => {
                arrays.saved = result.data.results
            });
            this.updateSaveButton(this.saveText, this.saveColor, true, 800);
            resolve();
      });
    });
  }

  saveSet(index, local, serviceToUse) {
      var call = null;
      var elm = local[index];
      return this.$q((resolve, reject) => {
        if (elm.is_new) {
            call = serviceToUse.create(elm);
        } else if (elm.is_modified) {
            call = serviceToUse.update(elm.id, elm);
        } else {
            resolve(); //"no reason call a request";
            return;
        }
        call.then( (data) => {
            local[index] = data.data;
            resolve(); //"saved"
        }, (error) => { // Catch name error
            local[index].nameError = true;
            reject(index); //"name error"
        });
      });
  }

  checkIfModified(index, arrays) {
    var modified = false;
    // Checks if index is new. If it is, there is no need to check if it has been modified.
    if (arrays.local[index].is_new){
        modified = true;
    } else {
        var keys = Object.keys(arrays.local[index]);
        keys.forEach((key) => {
          /*  Checks if a value on the local copy differs from a value on the database copy. If so, it calls the 'checkForUnsavedChanges' method.
           *  Ignores '$$hashKey' key, which angular adds when copying an object.
           *  Ignores 'hover', which I believe angular also adds.
           *  Ignores 'is_modified', which this controller adds to local copy to keep track of saved or unsaved changes.
           *  Ignores 'accountRemove', which this controller adds to local copy in order to prevent the deletion of user roles that are used by active accounts.
           */
          if (key != '$$hashKey' && key != 'hover' && key != 'is_modified' && key != 'accountRemoved' && arrays.local[index][key] != arrays.saved[index][key]) {
            modified = true;
          }
        });
    }

    if (modified) {
      arrays.local[index].is_modified = true;
    } else {
      arrays.local[index].is_modified = false;
    }
    this.checkForUnsavedChanges(arrays);
  }

  checkForUnsavedChanges(arrays) {
    var unsaved = false;
    if (arrays.local.length > arrays.saved.length){
        unsaved = true;
    } else {
        arrays.local.forEach((elm) => {
          if (elm.is_modified) { unsaved = true; return;}
        });
    }

    if (unsaved){
        this.updateSaveButton(this.saveText, this.saveColor, true);
    } else {
        this.updateSaveButton(this.savedText, this.savedColor, false);
    }
  }

  updateSaveButton(text, color, unsavedChanges, time) {
    this.$timeout(() => {
      this.saveButtonInfo.saveButtonText = text;
      this.saveButtonInfo.saveButtonColor = color;
      if (unsavedChanges == true || unsavedChanges == false) {
        this.saveButtonInfo.unsavedChanges = unsavedChanges;
      }
    }, time);
  }

  updateAccountButton(text, color, time) {
    this.$timeout(() => {
      this.accountButtonInfo.accountButtonText = text;
      this.accountButtonInfo.accountButtonColor = color;
    }, time);
  }

  discardChanges(arrays) {
    arrays.local = angular.copy(arrays.saved);
    this.updateSaveButton(this.savedText, this.savedColor, false);
  }

  /**This method is called from both the 'switchActive' method if a user tries to change tabs while unsaved changes.
   * This method is called from the '$stateChangeStart' event if a user tries to change tabs while unsaved changes.
   */
  openUnsavedChangesModal(index = 0, toState = null) {
    var selection = this.$uibModal.open({
      templateUrl:'app/account/components/modal/unsavedChangesModal.html',
      controller: 'UnsavedChangesModalController',
      controllerAs: 'UnsavedChangesModalCtrl'
    });
    selection.result.then((result) => {
      if (result == 'save') {
          //Determines which arrays to save based on which tab is active
          if (this.sections.allSections[this.tabInfo.active].name == this.tab_2_name) {
              //Beginning of promise chain (saveAll() => saveSet())
              var promise = this.saveAll(this.accounts, this.AccountService);
          } else if (this.sections.allSections[this.tabInfo.active].name == this.tab_3_name) {
              var promise = this.saveAll(this.permissions, this.PermissionsSetsService);
          }
      } else {
          if (this.sections.allSections[this.tabInfo.active].name == this.tab_2_name) {
              this.discardChanges(this.accounts);
          } else if (this.sections.allSections[this.tabInfo.active].name == this.tab_3_name) {
              this.discardChanges(this.permissions);
          }
          var promise = this.$q.resolve();
      }
      promise.then((reason) => {
        //If saving was successful and a toState has been provided, redirect to that state
        this.saveButtonInfo.unsavedChanges = false;
        if (toState != null) {
            this.$state.go(toState);
        } else {
            //If no state was provided, then navigate the provided tab.
            this.activateTab(index);
        }
      });
    });
  }

  //Account List Tab
  resendActivationEmail(accountID) {
    this.AccountService.resendActivationEmail(accountID);
  }


  //Account List Tab
  deleteAccount(account){
    if(this.currentuser.id != account.id){
      if(account.accountdelete){
        this.AccountService.destroy(account.id).then(() =>{
            window.toastr.success("Account Successfully Deleted");
            this.AccountService.getAccounts().then((response) =>{
              this.accounts.local = response.data;
              this.accounts.saved = angular.copy(this.accounts.local);
          });
        });
      }
      else{
        account.accountdelete = true;
      }
    }
  }

  //Account Access Controls Tab
  changeUserRole(index) {
      this.PermissionsSetsService.getPermission(this.accounts.local[index].user_designation).then((result) => {
          this.accounts.local[index].permission_irf_view =  result.data.permission_irf_view;
          this.accounts.local[index].permission_irf_add = result.data.permission_irf_add;
          this.accounts.local[index].permission_irf_edit = result.data.permission_irf_edit;
          this.accounts.local[index].permission_irf_delete = result.data.permission_irf_delete;
          this.accounts.local[index].permission_vif_view = result.data.permission_vif_view;
          this.accounts.local[index].permission_vif_add = result.data.permission_vif_add;
          this.accounts.local[index].permission_vif_edit = result.data.permission_vif_edit;
          this.accounts.local[index].permission_vif_delete = result.data.permission_vif_delete;
          this.accounts.local[index].permission_border_stations_view = result.data.permission_border_stations_view;
          this.accounts.local[index].permission_border_stations_add = result.data.permission_border_stations_add;
          this.accounts.local[index].permission_border_stations_edit = result.data.permission_border_stations_edit;
          this.accounts.local[index].permission_border_stations_delete = result.data.permission_border_stations_delete;
          this.accounts.local[index].permission_accounts_manage = result.data.permission_accounts_manage;
          this.accounts.local[index].permission_receive_email = result.data.permission_receive_email;
          this.accounts.local[index].permission_address2_manage = result.data.permission_address2_manage;
          this.accounts.local[index].permission_budget_manage = result.data.permission_budget_manage;
      });
      this.checkIfModified(index, this.accounts);
  }

  //Account Defaults Tab
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
      permission_address2_manage: false,
      permission_vif_add: false,
      permission_vif_delete: false,
      permission_vif_edit: false,
      permission_vif_view: false
    });
    this.checkForUnsavedChanges(this.permissions);
  }

  //Account Defaults Tab
  deletePermissionRole(index) {
    var pSet = this.permissions.local[index];
    if (!pSet.is_used_by_accounts){
      if(pSet.accountRemoved){
        if (pSet.is_new) {
            // Local delete
          window.toastr.success("Account Role Successfully Deleted");
          this.permissions.local.splice(index, 1);
          this.checkForUnsavedChanges(this.permissions);
        } else {
            // Database delete
            this.permissions.local.splice(index, 1);
            this.PermissionsSetsService.destroy(pSet.id).then(() => {
                window.toastr.success("Account Role Successfully Deleted");
                this.permissions.saved = angular.copy(this.permissions.local);
                this.checkForUnsavedChanges(this.permissions);
            });
        }
      }
      else{
        pSet.accountRemoved = true;
      }
    }
  }

  //Account Edit Tab
  //Used when updating or creating an account
  updateOrCreate() {
      if(!this.checkFields()){
          return;
      }
      var call;
      if(this.editing) {
          this.updateAccountButton(this.updatingText, this.updatingOrCreatingColor);
          call = this.AccountService.update(this.account.id, this.account);
      }else {
          this.updateAccountButton(this.creatingText, this.updatingOrCreatingColor);
          call= this.AccountService.create(this.account);
      }
      call.then(() => {
          this.$timeout(() => {
            if(this.editing){
                window.toastr.success("Account Updated");
            } else {
                window.toastr.success("Account Created");
            }
            this.$state.go("account", {activeTab: 0});
          }, 300);
      }, (err) => {
          this.$timeout(() => {
            if (err.data.email) {
              this.emailError = err.data.email[0];
              this.getUpdateButtonText();
            }
          }, 300);
      });
  }

  //Account Edit Tab
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

  resetErrors() {
    this.emailError = '';
    this.userDesignationError = '';
  }

  //Account Edit Tab
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

  //Account Edit Tab
  getButtonText(has_permission) {
      if(has_permission) {
          return "Yes";
      }
      return "No";
  }

  //Account Edit Tab
  getUpdateButtonText() {
      if(this.editing) {
          this.updateAccountButton(this.updateText, this.inputColor);
      } else {
          this.updateAccountButton(this.createText, this.inputColor);
      }
  }
}