export default class MdfController {
    constructor(BudgetListService, $stateParams, $state, $sce, toastr) {
        'ngInject';
        this.staff = [];
        this.committeeMembers = [];
        this.nationalStaff = [];

        this.service = BudgetListService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.sce = $sce;
        this.toastr = toastr;

        this.retrieveMdf();
    }

    /* National Staff have a property permission_can_receive_mdf which is different from receives_money_distribution_form. 
    The former is what gets them put on this list of possible recipients, the latter is whether or not they actually receive
    this months MDF for this station. */
    retrieveMdf() {
        this.service.getMdf(this.stateParams.id).then((promise) => {
            this.staff = promise.data.staff_members;
            this.committeeMembers = promise.data.committee_members;
            this.nationalStaff = promise.data.national_staff_members;
            this.nationalStaff.forEach((staff) => {
                staff.receives_money_distribution_form = true;
            });
            this.createIframe(promise.data.pdf_url);
        },
            () => {
                this.toastr.error(`Could not find requested MDF`);
            }
        );
    }

    // This might look a little hack-y... well, it might be :P but it's really hard to make iframes work with angular!
    createIframe(src) {
        src = this.sce.trustAsResourceUrl(src);
        this.pdfFrame = this.sce.trustAsHtml(`<iframe src="${src.toString()}" class="pdf" width="100%" height="600px"></iframe>`);
        return this.pdfFrame;
    }

    getIds(sourceObject, destinationObject, attribute) {
        sourceObject.forEach((object) => {
            if (object.receives_money_distribution_form) {
                destinationObject[attribute].push(object.id);
            }
        });
        return destinationObject;
    }

    sendEmails() {
        var people = { "staff_ids": [], "committee_ids": [], "national_staff_ids": [] };
        people = this.getIds(this.staff, people, "staff_ids");
        people = this.getIds(this.committeeMembers, people, "committee_ids");
        people = this.getIds(this.nationalStaff, people, "national_staff_ids");
        people.budget_id = this.stateParams.id;

        this.service.sendMdfEmails(people).then(() => {
            this.toastr.success(`Successfully emailed the MDF`);
            this.state.go('budgetList'); // When the emails have been sent, load next page in the workflow (the budget list)
        },
            () => {
                this.toastr.error(`Could not send emails`);
            }
        );
        return people;
    }

    recipientSelected() {
        var recipientSelected = false;
        this.staff.forEach((object) => {
            if (object.receives_money_distribution_form) {
                recipientSelected = true;
            }
        });
        this.committeeMembers.forEach((object) => {
            if (object.receives_money_distribution_form) {
                recipientSelected = true;
            }
        });
        this.nationalStaff.forEach((object) => {
            if (object.receives_money_distribution_form) {
                recipientSelected = true;
            }
        });
        return recipientSelected;
    }
}
