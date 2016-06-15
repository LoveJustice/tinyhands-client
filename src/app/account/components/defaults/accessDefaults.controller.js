import Constants from '../../constants';
export default class AccessDefaultsController {
    constructor($scope, $timeout, $q, $uibModal, $state, PermissionsSetsService) {
        'ngInject';
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$q = $q;
        this.$uibModal = $uibModal;
        this.$state = $state;
        this.PermissionsSetsService = PermissionsSetsService;
        
        this.permissions = {
            local: [],
            saved: []
        };
        
        this.saveButtonInfo = {
            saveButtonText: Constants.saveButton.savedText,
            saveButtonColor: Constants.saveButton.savedColor,
            unsavedChanges: false
        };
        
        this.getPermissions();
        
        this.createOnStateChangeListener();
        
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
                this.openUnsavedChangesModal(toState.name);
            }
        });
    }
    
    getStyling(attribute) {
        if (attribute){
            return 'btn btn-success';
        }
        else {
            return 'btn btn-danger';
        }
    }
    
    checkIfModified(index) {
        this.permissions.local[index].is_modified = false;
        // Checks if index is new. If it is, there is no need to check if it has been modified.
        if (this.permissions.local[index].is_new){
            this.permissions.local[index].is_modified = true;
        } else {
            var keys = Object.keys(this.permissions.local[index]);
            keys.forEach((key) => {
                /*  Checks if a value on the local copy differs from a value on the database copy.
                *  Ignores '$$hashKey' key, which angular adds when copying an object.
                *  Ignores 'hover', which I believe angular also adds.
                *  Ignores 'is_modified', which this controller adds to local copy to keep track of saved or unsaved changes.
                *  Ignores 'accountRemove', which this controller adds to local copy in order to prevent the deletion of
                *  user roles that are used by active accounts.
                */
                if (key !== '$$hashKey' && key !== 'hover' && key !== 'is_modified' && key !== 'accountRemoved' && this.permissions.local[index][key] !== this.permissions.saved[index][key]) {
                    this.permissions.local[index].is_modified = true;
                }
            });
        }
        this.checkForUnsavedChanges();
    }

    checkForUnsavedChanges() {
        var unsaved = false;
        if (this.permissions.local.length > this.permissions.saved.length){
            unsaved = true;
        } else {
            this.permissions.local.forEach((elm) => {
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
            if (unsavedChanges === true || unsavedChanges === false) {
                this.saveButtonInfo.unsavedChanges = unsavedChanges;
            }
        }, time);
    }
    
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
    
    discardChanges() {
        this.permissions.local = angular.copy(this.permissions.saved);
        this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false);
    }
    
    saveAll() {
        this.updateSaveButton(Constants.saveButton.savingText, Constants.saveButton.savingColor, true);
        return this.$q( (resolve) => {
            var promises = [];
            this.permissions.local.forEach((elm, index) => {
                promises.push(this.saveSet(index, this.permissions.local));
            });

            // Waiting for all permissionsSets to be saved via saveSet()
            this.$q.all(promises).then( () => {
                this.permissions.saved = angular.copy(this.permissions.local);
                this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false, 800);
                resolve();
            }, () => {
                if (this.sections.allSections[this.tabInfo.active].name === this.tab_2_name) {
                    window.toastr.error("One or more Account Settings could not be saved");
                }
                else if (this.sections.allSections[this.tabInfo.active].name === this.tab_3_name) {
                    this.PermissionsSetsService.getPermissions().then((result) => {
                        this.permissions.saved = result.data.results;
                    });
                    this.updateSaveButton(Constants.saveButton.saveText, Constants.saveButton.saveColor, true, 800);
                    resolve();
                    window.toastr.error("One or more Designations could not be saved");
                }
            });
        });
    }

    saveSet(index, local) {
        var call = null;
        var elm = local[index];
        return this.$q((resolve, reject) => {
            if (elm.is_new) {
                call = this.PermissionsSetsService.create(elm);
            } else if (elm.is_modified) {
                call = this.PermissionsSetsService.update(elm.id, elm);
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
    
    openUnsavedChangesModal(toState = null) {
        var selection = this.$uibModal.open({
            templateUrl:'app/account/components/modal/unsavedChangesModal.html',
            controller: 'UnsavedChangesModalController',
            controllerAs: 'UnsavedChangesModalCtrl'
        });
        selection.result.then((shouldSave) => {
            let promise = this.$q.resolve();
            if (shouldSave) {
                promise = this.saveAll(this.permissions, this.PermissionsSetsService);
            }
            promise.then( () => {
                this.saveButtonInfo.unsavedChanges = false;
                if (toState !== null) {
                    this.$state.go(toState);
                }
            });
        });
    }
}