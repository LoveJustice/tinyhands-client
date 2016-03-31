export default class AccountController {
  constructor($q, $scope, $timeout, $uibModal, $state) {
    'ngInject';
    // Modules
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;

    //Scope variables
    let accountOptionsPath = 'app/account/components/';
    this.sections = {allSections: [{ name: 'Accounts List', templateUrl: `${accountOptionsPath}list/accountList.html` },
                                   { name: 'Accounts Access Control', templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                   { name: 'Accounts Defaults', templateUrl: `${accountOptionsPath}defaults/accountDefaults.html` }]}

    this.tabInfo = {'active': 0, 'sectionTemplateUrl': this.sections.allSections[0].templateUrl};
    this.$scope.saveInfo = {'arrays': null, 'serviceToUse': null, 'saveAll': null};

    this.saveButtonInfo = {"saveButtonText":"Saved", "saveButtonColor":"btn-primary", "unsavedChanges": false};
    this.saveText= "Save All";
    this.savingText = "Saving...";
    this.savedText = "Saved";
    this.saveColor = "btn-success";
    this.savingColor = "btn-success";
    this.savedColor = "btn-primary";
    this.index = null;
    this.toStateName = null;

    //This block is executed after user saves or discards changes via unsavedChangesModal
    this.$scope.$watchCollection(() => this.$scope.saveInfo, (newValue, oldValue)=> {
      if (newValue != oldValue){
        if (this.$scope.saveInfo.saveAll) {
            var promise = this.saveAll(this.$scope.saveInfo.arrays, this.$scope.saveInfo.serviceToUse);
        } else {
            this.discardChanges(this.$scope.saveInfo.arrays);
            var promise = this.$q.resolve();
        }
        promise.then((reason) => {
           //Beginning of promise chain (saveAll() => saveSet())
          //If saving was successful, redirect to desired page.
          this.saveButtonInfo.unsavedChanges = false;
          if (this.toStateName != null) {
              this.$state.go(this.toStateName);
              this.toStateName = null;
          } else {
              this.activate(this.index);
          }
        });
      }
    });

    this.$scope.$on('$stateChangeStart', (e, toState) => {
      if (this.saveButtonInfo.unsavedChanges) {
        e.preventDefault();
        this.toStateName = toState.name;
        this.openUnsavedChangesModal();
      }
    });

    this.$scope.$on('checkForUnsavedChange()', (event, arrays) => {
      this.checkForUnsavedChanges(arrays);
    });
  }

  switchActive(index){
    if (this.saveButtonInfo.unsavedChanges == true) {
        this.index = index;
        this.openUnsavedChangesModal();
    } else {
        this.activate(index);
    }
  }

  activate(index){
    this.tabInfo.active = index;
    this.tabInfo.sectionTemplateUrl = this.sections.allSections[index].templateUrl;
  }

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
          this.$timeout(() => {
              this.$scope.$apply();
              this.updateSaveButton(this.savedText, this.savedColor, false);
              resolve();
          }, 800);
      }, (error) => {
          arrays.saved = angular.copy(arrays.local);
          this.updateSaveButton(this.saveText, this.saveColor, null, 800);
          reject(error);
      });
    });
   return true;
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
            resolve("no need to re-save");
            return;
        }
        call.then( (data) => {
            local[index] = data.data;
            resolve();
        }, (error) => { // Catch name error
            elm.nameError = true;
            reject("nameError");
        });
      });
  }
  //[index, data.data.id]

  checkIfModified(index, arrays) {
    // Checks if pSet is new. If it is, there is no need to check if it has been modified.
    if ((!arrays.local[index].hasOwnProperty('is_new')) || arrays.local[index].is_new == false) {
      var modified = false;
      var keys = Object.keys(arrays.local[index]);
      keys.forEach((key) => {
        // Checks if a permission value on local copy differs from a permission value in database
        // Ignores '$$hashKey' key, which angular adds when copying an object.
        // It also ignores 'is_modified', since savedPermissionsSets does not have that property.
        if (key != '$$hashKey' && key != 'is_modified' && key != 'hover' && key != 'accountRemoved' && arrays.local[index][key] != arrays.saved[index][key]) {
          modified = true;
        }
      });
      if (modified) {
        arrays.local[index].is_modified = true;
      } else {
        arrays.local[index].is_modified = false;
      }
      this.checkForUnsavedChanges(arrays);
    }
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

  updateSaveButton(text, color, changes, time) {
    this.$timeout(() => {
      this.saveButtonInfo.saveButtonText = text;
      this.saveButtonInfo.saveButtonColor = color;
      if (changes != null) {
        this.saveButtonInfo.unsavedChanges = changes;
      }
    }, time);
  }

  discardChanges(arrays) {
    arrays.local = angular.copy(arrays.saved);
    this.updateSaveButton(this.savedText, this.savedColor, false);
  }

  openUnsavedChangesModal() {
    var selection = this.$uibModal.open({
      templateUrl:'app/account/components/defaults/unsavedChangesModal.html',
      controller: 'UnsavedChangesModalController',
      controllerAs: 'UnsavedChangesModalCtrl'
    });
    selection.result.then((result) => {
      if (result == 'save') {
          this.$scope.$broadcast('getSaveAllParameters', this.sections.allSections[this.tabInfo.active].name);
      } else {
          this.$scope.$broadcast('getDiscardChangesParameters', this.sections.allSections[this.tabInfo.active].name);
      }
    });
  }

}