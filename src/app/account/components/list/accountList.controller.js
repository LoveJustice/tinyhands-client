export default class AccountListController {
    constructor(AccountService, toastr) {
        'ngInject';
        this.AccountService = AccountService;
        this.toastr = toastr;
        
        this.accounts = [];
        
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
            this.accounts = result.data;
        });
    }
    
    //Account List Tab
    resendActivationEmail(accountID) {
        this.AccountService.resendActivationEmail(accountID)
            .then(
                () => {
                    this.toastr.success("Email Sent!");
                },
                () => {
                    this.toastr.error("Email Not Sent!");
                }
        );
    }


    //Account List Tab
    deleteAccount(account){
        if(this.currentUser.id !== account.id){
            this.AccountService.destroy(account.id).then(() =>{
                this.toastr.success("Account Successfully Deleted");
                this.getAccounts();
            });
        }
    }
}