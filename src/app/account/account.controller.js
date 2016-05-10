import Constants from './constants.js';

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
    // Also check the 'saveAll' method in order to make sure you are displaying the appropriate save errors.
    this.tab_1_name = 'Accounts List';
    this.tab_2_name = 'Accounts Access Control';
    this.tab_3_name = 'Accounts Defaults'

    //Scope variables
    let accountOptionsPath = 'app/account/components/';
    this.editAccountPath = `${accountOptionsPath}edit/accountEdit.html`;
    this.accountNotFoundPath = `${accountOptionsPath}edit/accountNotFound.html`;
    this.sections = {
      allSections: [
        { name: this.tab_1_name , templateUrl: `${accountOptionsPath}list/accountList.html` },
        { name: this.tab_2_name , templateUrl: `${accountOptionsPath}control/accountControl.html` },
        { name: this.tab_3_name , templateUrl: `${accountOptionsPath}defaults/accountDefaults.html`}
    ]}
    //Stores information about the 'active' tab selected, as well as the current html template to display.
    this.tabInfo = {
      'active': null,
      'sectionTemplateUrl': null
    };
    this.saveButtonInfo = {
      saveButtonText: Constants.saveButton.savedText,
      saveButtonColor: Constants.saveButton.savedColor,
      unsavedChanges: false
    };
    this.accountButtonInfo = {
      accountButtonText: "",
      accountButtonColor: Constants.createOrUpdateButton.inputColor
    };
    this.accounts = {};
    this.permissions = {};

    //Used by 'Account List' tab
    this.getCurrentUser();
    //Used by 'Account List' and 'Account Access Controls' tabs
    this.getAccounts();
    //Used by 'Account List' and 'Account Access Controls' and 'Account Defaults' tabs
    this.getPermissions();
    //Prevents changing states if unsaved changes
    this.createOnStateChangeListener();

    this.displayPage();
  }

  getCurrentUser(){
    this.AccountService.getMe().then((response) => {
      this.currentuser = response.data;
    });
  }

  getAccounts(){
    this.AccountService.getAccounts().then((result) => {
      this.accounts.local = result.data;
      // Creates a deep copy of accounts.local
      this.accounts.saved = angular.copy(this.accounts.local);
      // accounts.local is compared against accounts.saved to check for unsaved changes.
    });
  }

  getPermissions(){
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissions.local = result.data.results;
      // Creates a deep copy of permissions.local
      this.permissions.saved = angular.copy(this.permissions.local);
      // permissions.local is compared against permissions.saved to check for unsaved changes.
    });
  }

  createOnStateChangeListener(){
    this.$scope.$on('$stateChangeStart', (e, toState) => {
      if (this.saveButtonInfo.unsavedChanges) {
        e.preventDefault();
        this.openUnsavedChangesModal(0, toState.name);
      }
    });
  }

   /** This checks the URL params to see if a userId param is present.
   *   If a userId is present, it opens the editUser tab. If no userId is present,
   *   it checks the URL params to see if an activeTab param is present.
   *   If an activeTab is present, it diplays that tab.
   *   If the active Tab is not given, it defaults to 0, which is the 'this.tab_1_name'
   */
  displayPage(){
    if (this.$state.params.id) {
      if (this.$state.params.id == 'create') {
        this.accountCreate();
      } else {
        this.retrieveAccount(this.$state.params.id);
      }
    } else {
      if (this.$state.params.activeTab == undefined) {
        this.$state.params.activeTab = 0;
      }
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
    this.$state.go('account', {activeTab: index});
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
    this.tabInfo.active = null; //Causes no nav-bar tab to be selected
    this.tabInfo.sectionTemplateUrl = this.editAccountPath;

    this.account = account;
    this.editing = true;
    this.resetErrors();
    this.getUpdateButtonText();
    this.title = `Edit ${this.account.first_name} ${this.account.last_name}'s Account`;

    //Change to the Edit User State
    this.$state.go('account/:id', {id: this.account.id});
  }

  accountCreate(){
    this.tabInfo.active = null; //Causes no nav-bar tab to be selected
    this.tabInfo.sectionTemplateUrl = this.editAccountPath;

    this.editing = false;
    this.resetErrors();
    this.getUpdateButtonText();
    this.title = 'Create Account';
    this.account = {};

    //Change to the Edit User State
    this.$state.go('account/:id', {id: 'create'});
  }

  accountNotFound(id){
    this.idNotFound = id;
    this.tabInfo.active = -1; //Causes no nav-bar tab to be selected
    this.tabInfo.sectionTemplateUrl = this.accountNotFoundPath;
  }

  //This method is used to save the account and permissions arrays
  saveAll(arrays, serviceToUse) {
    this.updateSaveButton(Constants.saveButton.savingText, Constants.saveButton.savingColor, true);
    return this.$q((resolve, reject) => {
      var promises = [];
      arrays.local.forEach((elm, index) => {
        promises.push(this.saveSet(index, arrays.local, serviceToUse));
      });

      // Waiting for all permissionsSets to be saved via saveSet()
      this.$q.all(promises).then((data) => {
          arrays.saved = angular.copy(arrays.local);
          this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false, 800);
          resolve();
      }, (error) => {
            if (this.sections.allSections[this.tabInfo.active].name == this.tab_2_name) {
              window.toastr.error("One or more Account Settings could not be saved");
            }
            else if (this.sections.allSections[this.tabInfo.active].name == this.tab_3_name) {
              this.PermissionsSetsService.getPermissions().then((result) => {
                arrays.saved = result.data.results
              });
              this.updateSaveButton(Constants.saveButton.saveText, Constants.saveButton.saveColor, true, 800);
              resolve();
              window.toastr.error("One or more Designations could not be saved");
            }
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
        }, () => { // Catch name error
            local[index].nameError = true;
            reject(index); //"name error"
        });
      });
  }

  /** Whenever a user toggles a 'Yes/No' Button on the 'Account Controls' and 'Account Defaults' pages,
   * this method checks to see if any values in the local array do equals the value in the saved array. If there is
   * an unequal value, the set in the array is marked as 'modified'. Then the 'checkForUnsavedChanges' method
   * is called, which checks if any of the sets are modified and controls the saved button functionality to display the
   * appropriate text and button color depending on if there are unsaved changes or no unsaved changes.
   */
  checkIfModified(index, arrays) {
    arrays.local[index].is_modified = false;
    // Checks if index is new. If it is, there is no need to check if it has been modified.
    if (arrays.local[index].is_new){
        arrays.local[index].is_modified = true;
    } else {
        var keys = Object.keys(arrays.local[index]);
        keys.forEach((key) => {
          /*  Checks if a value on the local copy differs from a value on the database copy.
           *  Ignores '$$hashKey' key, which angular adds when copying an object.
           *  Ignores 'hover', which I believe angular also adds.
           *  Ignores 'is_modified', which this controller adds to local copy to keep track of saved or unsaved changes.
           *  Ignores 'accountRemove', which this controller adds to local copy in order to prevent the deletion of
            *  user roles that are used by active accounts.
           */
          if (key != '$$hashKey' && key != 'hover' && key != 'is_modified' && key != 'accountRemoved'
            && arrays.local[index][key] != arrays.saved[index][key]) {
            arrays.local[index].is_modified = true;
          }
        });
    }
    this.checkForUnsavedChanges(arrays);
  }

  checkForUnsavedChanges(arrays) {
    var unsaved = false;
    if (arrays.local.length > arrays.saved.length){
        unsaved = true;
    } else {
        arrays.local.forEach((elm) => {
          if (elm.is_modified) {
            unsaved = true;
            return;
          }
        });
    }

    if (unsaved){
        this.updateSaveButton(Constants.saveButton.saveText, Constants.saveButton.saveColor, true);
    } else {
        this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false);
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
    this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false);
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
      if (result == Constants.unsavedChangesModalOptions.save) {
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
      is_used_by_accounts: false
    });
    this.checkForUnsavedChanges(this.permissions);
  }

  //Account Defaults Tab
  deletePermissionRole(index) {
    let permissionSet = this.permissions.local[index];
    if (!permissionSet.is_used_by_accounts){
      if(permissionSet.accountRemoved){
        if (permissionSet.is_new) {
            // Local delete
            window.toastr.success("Account Role Successfully Removed");
            this.permissions.local.splice(index, 1);
            this.checkForUnsavedChanges(this.permissions);
        } else {
            // Database delete
            var call = null;
            this.permissions.local.splice(index, 1);
            call =this.PermissionsSetsService.destroy(permissionSet.id);

            call.then(() => {
                window.toastr.success("Account Role Successfully Deleted");
                this.permissions.saved = angular.copy(this.permissions.local);
                this.checkForUnsavedChanges(this.permissions);
            }, () => {
                window.toastr.error("Deleting Unsuccessful");
            });
        }
      }
      else{
        permissionSet.accountRemoved = true;
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
          this.updateAccountButton(Constants.createOrUpdateButton.updatingText, Constants.createOrUpdateButton.updatingOrCreatingColor);
          call = this.AccountService.update(this.account.id, this.account);
      }else {
          this.updateAccountButton(Constants.createOrUpdateButton.creatingText, Constants.createOrUpdateButton.updatingOrCreatingColor);
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
          this.emailError = Constants.errors.emailIsRequired;
      }
      if(!this.account.user_designation){
          this.userDesignationError = Constants.errors.aUserDesignationIsRequired;
      }
      if(this.emailError == Constants.errors.emailIsRequired || this.userDesignationError == Constants.errors.aUserDesignationIsRequired) {
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
          this.account = permissions.data;
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
          this.updateAccountButton(Constants.createOrUpdateButton.updateText, Constants.createOrUpdateButton.inputColor);
      } else {
          this.updateAccountButton(Constants.createOrUpdateButton.createText, Constants.createOrUpdateButton.inputColor);
      }
  }
}