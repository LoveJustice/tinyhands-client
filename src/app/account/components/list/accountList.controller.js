export default class AccountListController {
    constructor(AccountService, StickyHeader, toastr) {
        'ngInject';
        this.AccountService = AccountService;
        this.sticky = StickyHeader;
        this.toastr = toastr;
        this.searchString = '';

        this.accounts = [];
        this.stickyOptions = this.sticky.stickyOptions;

        this.getAccounts(this.searchString);
        this.getCurrentUser();
    }

    getCurrentUser() {
        this.AccountService.getMe().then((response) => {
            this.currentUser = response.data;
        });
    }

    getAccounts() {
        this.AccountService.getAccounts(this.searchString).then((result) => {
            this.accounts = result.data.results;
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
    deleteAccount(account) {
        if (this.currentUser.id !== account.id) {
        	account.is_active = false;
            this.AccountService.update(account.id, account).then(() => {
                this.toastr.success("Account Successfully Deleted");
                this.getAccounts(this.searchString);
            });
        }
    }
}