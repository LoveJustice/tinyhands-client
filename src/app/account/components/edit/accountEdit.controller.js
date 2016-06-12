import Constants from '../../constants';
export default class AccountEditController {
    constructor($state, $stateParams, $timeout, AccountService, PermissionsSetsService) {
        'ngInject';
        this.$state = $state;
        this.AccountService = AccountService;
        this.PermissionsSetsService = PermissionsSetsService;
        this.$timeout = $timeout;
        if($stateParams.id !== 'create') {
            this.retrieveAccount($stateParams.id);
        }else {
            this.accountCreate();
        }
        
        this.getPermissions();
        
        this.permissions = {
            local: [],
            saved: []
        };
        
        this.accountButtonInfo = {
            accountButtonText: "",
            accountButtonColor: Constants.createOrUpdateButton.inputColor
        };
    }
    getPermissions(){
        this.PermissionsSetsService.getPermissions().then((result) => {
            this.permissions.local = result.data.results;
            // Creates a deep copy of permissions.local
            this.permissions.saved = angular.copy(this.permissions.local);
            // permissions.local is compared against permissions.saved to check for unsaved changes.
        });
    }
    
    retrieveAccount(id){
        this.AccountService.getAccount(id).then((result) => {
            this.accountEdit(result.data);
        }, (error) => {
            if (error.status === 404){
                this.accountNotFound(id);
            }
        });
    }

    accountEdit(account) {
        this.account = account;
        this.editing = true;
        this.resetErrors();
        this.getUpdateButtonText();
        this.title = `Edit ${this.account.first_name} ${this.account.last_name}'s Account`;

        //Change to the Edit User State
    }

    accountCreate(){
        this.editing = false;
        this.resetErrors();
        this.getUpdateButtonText();
        this.title = 'Create Account';
        this.account = {};
    }

    accountNotFound(id){
        this.idNotFound = id;
    }
    
     resetErrors() {
        this.emailError = '';
        this.userDesignationError = '';
    }
    
     getUpdateButtonText() {
        if(this.editing) {
            this.updateAccountButton(Constants.createOrUpdateButton.updateText, Constants.createOrUpdateButton.inputColor);
        } else {
            this.updateAccountButton(Constants.createOrUpdateButton.createText, Constants.createOrUpdateButton.inputColor);
        }
    }
    
    updateAccountButton(text, color, time) {
        this.$timeout(() => {
            this.accountButtonInfo.accountButtonText = text;
            this.accountButtonInfo.accountButtonColor = color;
        }, time);
    }
    
    onUserDesignationChanged(permissionSetId) {
        if (permissionSetId){
            this.PermissionsSetsService.getPermission(permissionSetId).then((permissions) => {
                this.applyDesignationToAccount(this.account, permissions.data);
            });
        }
    }
    
    applyDesignationToAccount(account, designation) {
        var designationKeys = Object.keys(designation);
        designationKeys.forEach( function(attribute) {
            if (attribute.substring(0,10) === "permission") {
                account[attribute] = designation[attribute];
            }
        });
    }
    
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
                this.$state.go('accounts.list');
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
        if(this.emailError === Constants.errors.emailIsRequired || this.userDesignationError === Constants.errors.aUserDesignationIsRequired) {
            return false;
        }
        return true;
    }
}