import ChangesArray from '../../changesArray';
export default class AccessDefaultsController {
    constructor($scope, $timeout, $q, $uibModal, $state, PermissionsSetsService) {
        'ngInject';
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$q = $q;
        this.$uibModal = $uibModal;
        this.$state = $state;
        this.PermissionsSetsService = PermissionsSetsService;
        
        this.permissions = {};
                
        this.getPermissions();
        
        this.createOnStateChangeListener();
        
    }
    
     get saveButtonText() {
        if(this.saveButtonClicked) {
            return 'Saving...';
        } else if(this.permissions.hasChanges) {
            return 'Save All';
        }else {
            return 'Saved';
        }
    }
    
    get saveButtonStyle() {
        if(this.saveButtonClicked) {
            return 'btn-success';
        } else {
            return 'btn-primary';
        }
    }
    
    getPermissions(){
        this.PermissionsSetsService.getPermissions().then((result) => {
            this.permissions = new ChangesArray(result.data.results, (x,y) => {
                if(x.id !== y.id || x.name !== y.name) {
                    return false;
                }
                var permissions = Object.keys(x).filter((key) => {return key.substring(0,10) === 'permission';});
                for(let i = 0; i < permissions.length; i++) {
                   if(x[permissions[i]] !== y[permissions[i]]) {
                       return false;
                   }
                }
                return true;
            });
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
    
    addAnother() {
        this.permissions.add({
            is_used_by_accounts: false
        });
    }

    //Account Defaults Tab
    deletePermissionRole(index) {
        this.permissions.remove(index);
    }
    
    discardChanges() {
        this.permissions.discardChanges();
    }
    
    saveAll() {
        this.saveButtonClicked = true;
        var promises = [];
        this.permissions.updatedItems.forEach((set) => {
            promises.push(this.updateSet(set));
        })
        this.permissions.newItems.forEach((set) => {
            promises.push(this.saveNewSet(set));
        });
        this.permissions.removedItems.forEach((set) => {
            promises.push(this.removeSet(set));
        });
        
        this.$q.all(promises).then( () => {
            this.saveButtonClicked = false;
            this.permissions.saveChanges();
        }, () => {
            this.saveButtonClicked = false;
            window.toastr.error("One or more Designations could not be saved");
        });
    }
    
    saveNewSet(set) {
        return this.PermissionsSetsService.create(set).then((response) => {
            set.id = response.data.id;
        }, () => {
        });
    }
    
    updateSet(set) {
        return this.PermissionsSetsService.update(set.id, set);
    }
    
    removeSet(set) {
        return this.PermissionsSetsService.destroy(set.id);
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
                promise = this.saveAll();
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