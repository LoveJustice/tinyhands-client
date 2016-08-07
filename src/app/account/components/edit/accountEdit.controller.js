export default class AccountEditController {
    constructor($state, $stateParams, AccountService, PermissionsSetsService, toastr) {
        'ngInject';
        this.$state = $state;
        this.AccountService = AccountService;
        this.PermissionsSetsService = PermissionsSetsService;
        this.toastr = toastr;
        this.account = null;        
        this.resetErrors();        
        if($stateParams.id !== 'create') {
            this.isEditingAccount = true;
            this.retrieveAccount($stateParams.id);
        }else {
            this.isEditingAccount = false;            
            this.account = {};
        }
        this.permissions = [];

        this.saveButtonClicked = false;

        this.getPermissions();
    }

    get title() {
        if(this.isEditingAccount && this.account) {
            return `Edit ${this.account.first_name} ${this.account.last_name}'s Account`;
        } else if(this.isEditingAccount) {
            return '';
        } else {
            return 'Create Account';
        }
    }

    get saveButtonText() {
        if(this.isEditingAccount && this.saveButtonClicked) {
            return 'Updating';
        } else if(this.isEditingAccount) {
            return 'Update';
        } else if(this.saveButtonClicked) {
            return 'Creating';
        } else {
            return 'Create';
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
            this.permissions = result.data.results;
        });
    }
    
    retrieveAccount(id){
        this.AccountService.getAccount(id).then((result) => {
            this.account = result.data;
        }, (error) => {
            if (error.status === 404){
                this.$state.go('accountNotFound');
            }
        });
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
        designationKeys.forEach((attribute) => {
            if (attribute.substring(0,10) === "permission") {
                account[attribute] = designation[attribute];
            }
        });
    }
    
    updateOrCreate() {
        if(!this.checkRequiredFieldsHaveValue()){
            return;
        }
        this.saveButtonClicked = true;
        var call;
        if(this.isEditingAccount) {
            call = this.AccountService.update(this.account.id, this.account);
        }else {
            call= this.AccountService.create(this.account);
        }
        call.then(() => {
            if(this.isEditingAccount){
                this.toastr.success("Account Updated");
            } else {
                this.toastr.success("Account Created");
            }
            this.saveButtonClicked = false;
            this.$state.go('accounts.list');
        }, (err) => {
            this.saveButtonClicked = false;
            if (err.data.email) {
                this.emailError = err.data.email[0];
            }
        });
    }

    checkRequiredFieldsHaveValue() {
        this.resetErrors();
        let areRequiredFieldsFilledIn = true;
        if(!this.account.email) {
            this.emailError = 'An email is required.';
            areRequiredFieldsFilledIn = false;
        }
        if(!this.account.user_designation){
            this.userDesignationError = 'A user designation is required.';
            areRequiredFieldsFilledIn = false;            
        }
        return areRequiredFieldsFilledIn;
    }

    resetErrors() {
        this.emailError = '';
        this.userDesignationError = '';
    }
}