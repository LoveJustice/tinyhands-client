export default class MdfController {
    constructor(BudgetListService, $stateParams, $state, $sce) {
        'ngInject';
        this.staff = {};
        this.committeeMembers = {};

        this.service = BudgetListService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.sce = $sce;

        this.retrieveMdf();
    }

    retrieveMdf() {
        this.service.getMdf(this.stateParams.id).then( (promise) => {
                this.staff = promise.data.staff_members;
                this.committeeMembers = promise.data.committee_members;
                this.createIframe(promise.data.pdf_url);
            },
            () => {
                window.toastr.error(`Could not find requested MDF`);
            }
        );
    }

    // This might look a little hack-y... well, it might be :P but it's really hard to make iframes work with angular!
    createIframe(src) {
        src = this.sce.trustAsResourceUrl(src);
        this.pdfFrame = this.sce.trustAsHtml(`<iframe src="${src.toString()}" class="pdf" width="100%" height="600px"></iframe>`);
    }

    sendEmails(){
        var people = {};
        people.budget_id = this.stateParams.id;
        people.staff_ids = [];
        people.committee_ids = [];

        for(var x = 0; x < this.staff.length; x++) {
            if (this.staff[x].receives_money_distribution_form) {
                people.staff_ids.push(this.staff[x].id);
            }
        }

        for(x=0; x < this.committeeMembers.length; x++){
            if (this.committeeMembers[x].receives_money_distribution_form) {
                people.committee_ids.push(this.committeeMembers[x].id);
            }
        }

        this.service.sendMdfEmails(people).then( () => {
            window.toastr.success(`Successfully emailed the MDF`);
            this.state.go('budgetList'); // When the emails have been sent, load next page in the workflow (the dashboard)
            },
            () => {
                window.toastr.error(`Could not send emails`);
            }
        );
    }
}
