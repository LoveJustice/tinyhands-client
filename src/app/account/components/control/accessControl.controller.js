import Constants from '../../constants.js';
export default class AccessControlController {
    constructor(AccountService, PermissionsSetsService, $timeout, $q) {
        this.AccountService = AccountService;
        this.PermissionsSetsService = PermissionsSetsService;
        this.$timeout = $timeout;
        this.$q = $q;
        this.accounts = {
            local: [],
            saved: []
        };
        this.permissions = {
            local: [],
            saved: []
        };
        
        this.saveButtonInfo = {
            saveButtonText: Constants.saveButton.savedText,
            saveButtonColor: Constants.saveButton.savedColor,
            unsavedChanges: false
        };
        
        this.getAccounts();
        this.getPermissions();
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
    
    getStyling(attribute) {
        if (attribute){
            return 'btn btn-success';
        }
        else {
            return 'btn btn-danger';
        }
    }
    
    changeUserRole(index) {
        this.PermissionsSetsService.getPermission(this.accounts.local[index].user_designation).then((result) => {
            this.applyDesignationToAccount(this.accounts.local[index], result.data);
        });
        this.checkIfModified(index, this.accounts);
    }
    
    togglePermission(account, permission, index) {
        account[permission] = !account[permission];
        this.checkIfModified(index, this.accounts);
    }
    
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
                if (key !== '$$hashKey' && key !== 'hover' && key !== 'is_modified' && key !== 'accountRemoved' && arrays.local[index][key] !== arrays.saved[index][key]) {
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
    
    discardChanges(arrays) {
        arrays.local = angular.copy(arrays.saved);
        this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false);
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
    
    saveAll(arrays, serviceToUse) {
        this.updateSaveButton(Constants.saveButton.savingText, Constants.saveButton.savingColor, true);
        return this.$q( (resolve) => {
            var promises = [];
            arrays.local.forEach((elm, index) => {
                promises.push(this.saveSet(index, arrays.local, serviceToUse));
            });

            // Waiting for all permissionsSets to be saved via saveSet()
            this.$q.all(promises).then( () => {
                arrays.saved = angular.copy(arrays.local);
                this.updateSaveButton(Constants.saveButton.savedText, Constants.saveButton.savedColor, false, 800);
                resolve();
            }, () => {
                if (this.sections.allSections[this.tabInfo.active].name === this.tab_2_name) {
                    window.toastr.error("One or more Account Settings could not be saved");
                }
                else if (this.sections.allSections[this.tabInfo.active].name === this.tab_3_name) {
                    this.PermissionsSetsService.getPermissions().then((result) => {
                        arrays.saved = result.data.results;
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
    
    applyDesignationToAccount(account, designation) {
        var designationKeys = Object.keys(designation);
        designationKeys.forEach( function(attribute) {
            if (attribute.substring(0,10) === "permission") {
                account[attribute] = designation[attribute];
            }
        });
    }
}