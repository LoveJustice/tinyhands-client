export default class AccountListController {
    constructor(AccountService) {
        'ngInject';
        this.AccountService = AccountService;
        
        this.accounts = {
            local: [],
            saved: []
        };
        
        this.getAccounts();
        this.getCurrentUser();
    }
    
    getCurrentUser(){
        this.AccountService.getMe().then((response) => {
            this.currentUser = response.data;
        });
    }
    
    getAccounts(){
        this.AccountService.getAccounts().then((result) => {
            this.accounts.local = result.data;
            // Creates a deep copy of accounts.local
            this.accounts.saved = angular.copy(this.accounts.local);
            // accounts.local is compared against accounts.saved to check for unsaved changes.
        });
    }
    
    //Account List Tab
    resendActivationEmail(accountID) {
        this.AccountService.resendActivationEmail(accountID)
            .then(
                () => {
                    window.toastr.success("Email Sent!");
                },
                () => {
                    window.toastr.error("Email Not Sent!");
                }
        );
    }


    //Account List Tab
    deleteAccount(account){
        if(this.currentUser.id !== account.id){
            if(account.accountdelete){
                this.AccountService.destroy(account.id).then(() =>{
                    window.toastr.success("Account Successfully Deleted");
                    this.AccountService.getAccounts().then((response) =>{
                        this.accounts.local = response.data;
                        this.accounts.saved = angular.copy(this.accounts.local);
                    });
                });
            }
            else{
                account.accountdelete = true;
            }
        }
    }
}