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
    this.permissionsSets = {};
    this.savedPermissionsSets = {};
    this.show = true;

    this.saveText= "Save All";
    this.savingText = "Saving...";
    this.savedText = "Saved";
    this.saveColor = "btn-success";
    this.savingColor = "btn-success";
    this.savedColor = "btn-primary";
    this.saveButtonText = this.savedText;
    this.saveButtonColor = this.savedColor;
    this.unsavedChanges = false;

    this.createListener();
    this.activate();

    this.$scope.$watch('permissionsSets',function(newVal, oldVal){},true);


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
    this.PermissionsSetsService.getPermissions().then((result) => {
      this.permissionsSets = result.data.results;
      // Creates a deep copy of permissionsSets
      this.savedPermissionsSets = angular.copy(this.permissionsSets);
      // PermissionsSets is compared against savedPermissionsSets to check for unsaved changes
    });
  }

  addAnother() {
    this.permissionsSets.push({
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
    this.checkForUnsavedChanges();
  }

  saveAll() {
    this.updateSaveButton(this.savingText, this.savingColor);
    return this.$q((resolve, reject) => {
      var promises = [];
      this.permissionsSets.forEach((elm,index) => {
        promises.push(this.saveSet(index));
      });

      // Waiting for all permissionsSets to be saved via saveSet()
      this.$q.all(promises).then(() => {
          this.savedPermissionsSets = angular.copy(this.permissionsSets);
          this.updateSaveButton(this.savedText, this.savedColor, 800);
          this.unsavedChanges = false;
          resolve();
      }, (error) => {
          this.savedPermissionsSets = angular.copy(this.permissionsSets);
          this.updateSaveButton(this.saveText, this.saveColor, 800);
          reject(error);
      });
    });

  }

  saveSet(index) {
      var call = null;
      var pSet = this.permissionsSets[index];
      return this.$q((resolve, reject) => {
        if (pSet.is_new) {
            call = this.PermissionsSetsService.create(pSet);
        } else if (pSet.is_modified) {
            call = this.PermissionsSetsService.update(pSet.id, pSet);
        } else {
            resolve("no need to re-save");
            return;
        }
        call.then( (data) => {
            this.permissionsSets[index] = data.data;
            resolve("successfully saved");
        }, (error) => { // Catch name error
            pSet.nameError = true;
            reject("nameError");
        });
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
    if (!this.permissionsSets[index].hasOwnProperty('is_new')) {
      var modified = false;
      var keys = Object.keys(this.permissionsSets[index]);
      keys.forEach((key) => {
        // Checks if a permission value on local copy differs from a permission value in database
        // Ignores '$$hashKey' key, which angular adds when copying an object.
        // It also ignores 'is_modified', since savedPermissionsSets does not have that property.
        if (key != '$$hashKey' && key != 'is_modified' && this.permissionsSets[index][key] != this.savedPermissionsSets[index][key]) {
          modified = true;
          return;
        }
      });
      if (modified) {
        this.permissionsSets[index].is_modified = true;
      } else {
        this.permissionsSets[index].is_modified = false;
      }
      this.checkForUnsavedChanges();
    }
  }

  checkForUnsavedChanges() {
    var unsaved = false;
    if (this.permissionsSets.length > this.savedPermissionsSets.length){
        unsaved = true;
    } else {
        this.permissionsSets.forEach((pSet) => {
          if (pSet.is_modified) { unsaved = true; return; }
        });
    }

    if (unsaved){
        this.updateSaveButton(this.saveText, this.saveColor);
        this.unsavedChanges = true;
    } else {
        this.updateSaveButton(this.savedText, this.savedColor);
        this.unsavedChanges = false;
    }
  }

  delete(index) {
    var pSet = this.permissionsSets[index];
    if (!pSet.is_used_by_accounts) this.openDeleteModal(pSet, index);
  }

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
            this.permissionsSets.splice(index, 1);
        } else {
            // Database delete
            this.permissionsSets.splice(index, 1);
            this.PermissionsSetsService.destroy(pSet.id).then(() => {
              this.savedPermissionsSets = angular.copy(this.permissionsSets);
            })
        }
      this.checkForUnsavedChanges();
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
    this.permissionsSets = angular.copy(this.savedPermissionsSets);
    this.updateSaveButton(this.savedText, this.savedColor);
    this.unsavedChanges = false;
  }

}
