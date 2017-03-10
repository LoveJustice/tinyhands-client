import unsavedChangesModalTemplate from '../modal/unsavedChangesModal.html';

import ChangesArray from '../../changesArray';

export default class AccessControlController {
    constructor(AccountService, PermissionsSetsService, StickyHeader, $q, $state, $uibModal, $scope, toastr) {
        this.AccountService = AccountService;
        this.PermissionsSetsService = PermissionsSetsService;
        this.sticky = StickyHeader;
        this.$q = $q;
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.$scope = $scope;
        this.toastr = toastr;

        this.accounts = {};
        this.saveButtonClicked = false;
        this.stickyOptions = this.sticky.stickyOptions;

        this.getAccounts();
        this.getPermissions();
        this.createOnStateChangeListener();
    }

    get saveButtonText() {
        if (this.saveButtonClicked) {
            return 'Saving...';
        } else if (this.accounts.hasChanges) {
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

    createOnStateChangeListener() {
        this.$scope.$on('$stateChangeStart', (e, toState) => {
            if (this.accounts.hasChanges) {
                e.preventDefault();
                this.openUnsavedChangesModal(toState.name);
            }
        });
    }

    getAccounts() {
        this.AccountService.getAccounts().then((response) => {
            this.accounts = new ChangesArray(response.data, angular.copy, (account1, account2) => {
                if (account1.user_designation !== account2.user_designation) {
                    return false;
                }
                var permissions = Object.keys(account1).filter((key) => { return key.substring(0, 10) === 'permission'; });
                for (let i = 0; i < permissions.length; i++) {
                    if (account1[permissions[i]] !== account2[permissions[i]]) {
                        return false;
                    }
                }
                return true;
            });
        });
    }

    getPermissions() {
        this.PermissionsSetsService.getPermissions().then((result) => {
            this.permissions = result.data.results;
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

    changeUserRole(account) {
        this.PermissionsSetsService.getPermission(account.user_designation).then((result) => {
            this.applyDesignationToAccount(account, result.data);
        });
    }

    applyDesignationToAccount(account, designation) {
        Object.keys(designation)
            .filter((key) => { return key.substring(0, 10) === "permission"; })
            .forEach((key) => {
                account[key] = designation[key];
            });
    }

    discardChanges() {
        this.accounts.discardChanges();
    }

    saveAll() {
        this.saveButtonClicked = true;
        let promises = [];
        this.accounts.updatedItems.forEach((account) => {
            promises.push(this.updateAccount(account));
        });

        return this.$q.all(promises).then(() => {
            this.saveButtonClicked = false;
            this.accounts.saveChanges();
        }, () => {
            this.saveButtonClicked = false;
            this.toastr.error("One or more Account Settings could not be saved");
        });

    }

    updateAccount(account) {
        return this.AccountService.update(account.id, account);
    }

    openUnsavedChangesModal(toState = null) {
        var selection = this.$uibModal.open({
            templateUrl: unsavedChangesModalTemplate,
            controller: 'UnsavedChangesModalController',
            controllerAs: 'UnsavedChangesModalCtrl'
        });
        selection.result.then((shouldSave) => {
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