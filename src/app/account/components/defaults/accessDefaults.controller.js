
import unsavedChangesModalTemplate from '../modal/unsavedChangesModal.html';
import ChangesArray from '../../changesArray';

export default class AccessDefaultsController {
    constructor(StickyHeader, $scope, $q, $uibModal, $state, PermissionsSetsService, toastr) {
        'ngInject';

        this.sticky = StickyHeader;
        this.$scope = $scope;
        this.$q = $q;
        this.$uibModal = $uibModal;
        this.$state = $state;
        this.PermissionsSetsService = PermissionsSetsService;
        this.toastr = toastr;

        this.permissions = {};
        this.saveButtonClicked = false;
        this.stickyOptions = this.sticky.stickyOptions;

        this.getPermissions();

        this.createOnStateChangeListener();
    }

    get saveButtonText() {
        if (this.saveButtonClicked) {
            return 'Saving...';
        } else if (this.permissions.hasChanges) {
            return 'Save All';
        } else {
            return 'Saved';
        }
    }

    get saveButtonStyle() {
        if (this.saveButtonClicked) {
            return 'btn-success';
        } else {
            return 'btn-primary';
        }
    }

    getPermissions() {
        this.PermissionsSetsService.getPermissions().then((result) => {
            this.permissions = new ChangesArray(result.data.results, angular.copy, (set1, set2) => {
                if (set1.id !== set2.id || set1.name !== set2.name) {
                    return false;
                }
                let permissions = Object.keys(set1).filter((key) => { return key.substring(0, 10) === 'permission'; });
                for (let i = 0; i < permissions.length; i++) {
                    if (set1[permissions[i]] !== set2[permissions[i]]) {
                        return false;
                    }
                }
                return true;
            });
        });
    }

    createOnStateChangeListener() {
        this.$scope.$on('$stateChangeStart', (e, toState) => {
            if (this.permissions.hasChanges) {
                e.preventDefault();
                this.openUnsavedChangesModal(toState.name);
            }
        });
    }

    getStyling(attribute) {
        if (attribute) {
            return 'btn btn-success btn-thin';
        }
        else {
            return 'btn btn-danger btn-thin';
        }
    }

    addAnother() {
        this.permissions.add({
            is_used_by_accounts: false
        });
    }

    //Account Defaults Tab
    removePermissionRole(index) {
        this.permissions.remove(index);
    }

    discardChanges() {
        this.permissions.discardChanges();
    }

    saveAll() {
        this.saveButtonClicked = true;
        let promises = [];
        this.permissions.updatedItems.forEach((set) => {
            promises.push(this.updateSet(set));
        });
        this.permissions.newItems.forEach((set) => {
            promises.push(this.createSet(set));
        });
        this.permissions.removedItems.forEach((set) => {
            promises.push(this.removeSet(set));
        });

        return this.$q.all(promises).then(() => {
            this.saveButtonClicked = false;
            this.permissions.saveChanges();
        }, () => {
            this.saveButtonClicked = false;
            this.toastr.error("One or more Designations could not be saved");
        });
    }

    createSet(set) {
        return this.PermissionsSetsService.create(set).then((response) => {
            set.id = response.data.id;
        }, (error) => {
            set.error = error.data.name[0];
            return this.$q.reject(error);
        });
    }

    updateSet(set) {
        return this.PermissionsSetsService.update(set.id, set).then(() => { },
            (error) => {
                set.error = error.data.name[0];
                return this.$q.reject(error);
            }
        );
    }

    removeSet(set) {
        return this.PermissionsSetsService.destroy(set.id);
    }

    openUnsavedChangesModal(toState = null) {
        this.$uibModal.open({
            templateUrl: unsavedChangesModalTemplate,
            controller: 'UnsavedChangesModalController',
            controllerAs: 'UnsavedChangesModalCtrl'
        }).result.then((shouldSave) => {
            let promise = this.$q.resolve();
            if (shouldSave) {
                promise = this.saveAll();
            } else {
                this.discardChanges();
            }
            promise.then(() => {
                if (toState !== null) {
                    this.$state.go(toState);
                }
            });
        });
    }
}