export default class AccountListController {
    constructor(AccountService, StickyHeader, toastr) {
        'ngInject';
        this.AccountService = AccountService;
        this.sticky = StickyHeader;
        this.toastr = toastr;

        this.accounts = [];
        this.stickyOptions = this.sticky.stickyOptions;

        this.getAccounts();
        this.getCurrentUser();
    }

    getCurrentUser() {
        this.AccountService.getMe().then((response) => {
            this.currentUser = response.data;
        });
    }

    getAccounts() {
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
    deleteAccount(account) {
        if (this.currentUser.id !== account.id) {
            this.AccountService.destroy(account.id).then(() => {
                this.toastr.success("Account Successfully Deleted");
                this.getAccounts();
            });
        }
    }
}