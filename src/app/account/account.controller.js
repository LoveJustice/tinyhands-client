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

    this.$scope.tabInfo = {'unsavedChanges': false,
                    'active': 0,
                    'sectionTemplateUrl': this.sections.allSections[0].templateUrl};

    this.$scope.saveInfo = {'arrays': null, 'saveButtonInfo': null, 'serviceToUse': null, 'saveAll': null};

    this.saveText= "Save All";
    this.savingText = "Saving...";
    this.savedText = "Saved";
    this.saveColor = "btn-success";
    this.savingColor = "btn-success";
    this.savedColor = "btn-primary";
    this.index = null;
    this.toStateName = null;

    this.$scope.$watchCollection(() => this.$scope.saveInfo, (newValue, oldValue)=> {
      if (newValue != oldValue){
        console.log('here');
        if (this.$scope.saveInfo.saveAll) {
            var promise = this.saveAll(this.$scope.saveInfo.arrays, this.$scope.saveInfo.saveButtonInfo, this.$scope.saveInfo.serviceToUse);
        } else {
            this.discardChanges(this.$scope.saveInfo.arrays, this.$scope.saveInfo.saveButtonInfo);
            var promise = this.$q.resolve();
        }
        promise.then((reason) => {
           //Beginning of promise chain (saveAll() => saveSet())
          //If saving was successful, redirect to desired page.
          this.$scope.tabInfo.unsavedChanges = false;
          if (this.toStateName != null) {
              this.$state.go(this.toStateName);
              this.toStateName = null;
          } else {
              this.activate(this.index);
          }
        });
      }
    });

    this.createListener();
  }
  createListener() {
    this.$scope.$on('$stateChangeStart', (e, toState) => {
      if (this.$scope.tabInfo.unsavedChanges) {
        e.preventDefault();
        this.toStateName = toState.name;
        this.openUnsavedChangesModal();
      }
    });

    this.$scope.$on('checkForUnsavedChange()', (event, data) => {
      this.checkForUnsavedChanges(data[0], data[1]);
    });
  }

  switchActive(index){
    if (this.$scope.tabInfo.unsavedChanges == true) {
        this.index = index;
        this.openUnsavedChangesModal();
    } else {
        this.activate(index);
    }
  }

  activate(index){
    this.$scope.tabInfo.active = index;
    this.$scope.tabInfo.sectionTemplateUrl = this.sections.allSections[index].templateUrl;
  }

  saveAll(arrays, saveButtonInfo, serviceToUse) {
    saveButtonInfo.unsavedChanges = true;
    this.updateSaveButton(saveButtonInfo, this.savingText, this.savingColor);
    return this.$q((resolve, reject) => {
      var promises = [];
      arrays.local.forEach((elm) => {
        promises.push(this.saveSet(elm, serviceToUse));
      });

      // Waiting for all permissionsSets to be saved via saveSet()
      this.$q.all(promises).then(() => {
          arrays.saved = angular.copy(arrays.local);
          this.$timeout(() => {
              this.updateSaveButton(saveButtonInfo, this.savedText, this.savedColor);
              saveButtonInfo.unsavedChanges = false;
              resolve();
          }, 800);
      }, (error) => {
          arrays.saved = angular.copy(arrays.local);
          this.updateSaveButton(saveButtonInfo, this.saveText, this.saveColor, 800);
          reject(error);
      });
    });
   return true;
  }

  saveSet(elm, serviceToUse) {
      var call = null;
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
            elm = data.data;
            resolve("successfully saved");
        }, (error) => { // Catch name error
            elm.nameError = true;
            reject("nameError");
        });
      });
  }

  checkIfModified(index, arrays, saveButtonInfo) {
    // Checks if pSet is new. If it is, there is no need to check if it has been modified.
    if (!arrays.local[index].hasOwnProperty('is_new')) {
      var modified = false;
      var keys = Object.keys(arrays.local[index]);
      keys.forEach((key) => {
        // Checks if a permission value on local copy differs from a permission value in database
        // Ignores '$$hashKey' key, which angular adds when copying an object.
        // It also ignores 'is_modified', since savedPermissionsSets does not have that property.
        if (key != '$$hashKey' && key != 'is_modified' && arrays.local[index][key] != arrays.saved[index][key]) {
          modified = true;
        }
      });
      if (modified) {
        arrays.local[index].is_modified = true;
      } else {
        arrays.local[index].is_modified = false;
      }
      this.checkForUnsavedChanges(arrays, saveButtonInfo);
    }
  }


  checkForUnsavedChanges(arrays, saveButtonInfo) {
    var unsaved = false;
    if (arrays.local.length > arrays.saved.length){
        unsaved = true;
    } else {
        arrays.local.forEach((elm) => {
          if (elm.is_modified) { unsaved = true; return;}
        });
    }

    if (unsaved){
        this.updateSaveButton(saveButtonInfo, this.saveText, this.saveColor);
        saveButtonInfo.unsavedChanges = true;
    } else {
        this.updateSaveButton(saveButtonInfo, this.savedText, this.savedColor);
        saveButtonInfo.unsavedChanges = false;
    }
  }

  updateSaveButton(saveButtonInfo, text, color, time) {
    this.$timeout(() => {
      saveButtonInfo.saveButtonText = text;
      saveButtonInfo.saveButtonColor = color;
    }, time);
  }

  discardChanges(arrays, saveButtonInfo) {
    arrays.local = angular.copy(arrays.saved);
    this.updateSaveButton(saveButtonInfo, this.savedText, this.savedColor);
    saveButtonInfo.unsavedChanges = false;
  }

  openUnsavedChangesModal() {
    var selection = this.$uibModal.open({
      templateUrl:'app/account/components/defaults/unsavedChangesModal.html',
      controller: 'UnsavedChangesModalController',
      controllerAs: 'UnsavedChangesModalCtrl'
    });
    selection.result.then((result) => {
      if (result == 'save') {
          this.$scope.$broadcast('getSaveAllParameters');
      } else {
          this.$scope.$broadcast('getDiscardChangesParameters');
      }
    });
  }

}