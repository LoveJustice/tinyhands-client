export default class IrfController {
    constructor($rootScope, $stateParams, UtilService, IrfService) {
        'ngInject';

        this.root = $rootScope;
        this.service = IrfService;
        this.$stateParams = $stateParams;
        this.utils = UtilService;

        this.errorList = [];
        this.errors = {};
        this.flagValue = this.root.flags;
        this.form = {};
        this.irfId = $stateParams.id;
        this.isCreating = !this.irfId;
        this.isViewing = $stateParams.isViewing === "true";
        this.numPersonBoxes = 1;
        this.page9 = {
            how_sure_was_trafficking_options: [
                { name: '--- Choose an option ---', val: null },
                { name: '1 - Not at all sure', val: 1 },
                { name: '2 - Unsure but suspects it', val: 2 },
                { name: '3 - Somewhat sure', val: 3 },
                { name: '4 - Very sure', val: 4 },
                { name: '5 - Absolutely sure', val: 5 }
            ]
        };
        this.root.flags = 0;
        this.sections = [];
        this.selectedSectionIndex = 0;
        this.selectedFlags = [];

        this.addSections();
        this.getIrf();
    }

    addSections() {
        this.sections.push('app/irf/form/components/metaData/metaData.html');
        for (var pageNum = 1; pageNum <= 9; pageNum++) {
            this.sections.push(`app/irf/form/components/page${pageNum}/page${pageNum}.html`);
        }
    }

    calculateFlagTotal() {
        for (let key in this.form) {
            if (this.form[key] && this.form[key].weight && this.form[key].value === true) {
                this.root.flags += this.form[key].weight;
            }
        }
    }

    createIrf() {
        this.form.date_form_received = new Date();
        this.service.createIrf().then(() => {
        }, (response) => {
            this.errors = response.data;
            this.errorList = this.utils.handleErrors(response);
        });
    }

    createOrUpdateIrf() {
        if (this.isCreating) {
            this.createIrf();
        } else {

        }
    }

    formatErrorField(error) {
        let field = error.field;
        field = field.split('_');
        for (var i in field) {
            field[i] = field[i].charAt(0).toUpperCase() + field[i].slice(1);
        }
        field = field.join(' ');
        return field;
    }

    getIrf() {
        this.page9.how_sure_was_trafficking = this.page9.how_sure_was_trafficking_options[0];
        if (this.irfId) {
            this.service.getIrf(this.irfId).then((response) => {
                this.form = response.data;
                this.form.date_time_of_interception = new Date(this.form.date_time_of_interception);
                this.page9.how_sure_was_trafficking = this.page9.how_sure_was_trafficking_options[this.form.how_sure_was_trafficking];
                this.calculateFlagTotal();
            });
        }
    }

    getFlagText() {
        if (this.root.flags > 0) {
            if (this.root.flags < 50) {
                this.flagValue = this.root.flags;
                return this.flagValue;
            } else {
                this.flagValue = 50;
                return '50 or More Flags';
            }
        }
        this.flagValue = 0;
        return '';
    }

    nextSection() {
        if (this.selectedSectionIndex < (this.sections.length - 1)) {
            this.selectedSectionIndex += 1;
        }
    }

    previousSection() {
        if (this.selectedSectionIndex > 0) {
            this.selectedSectionIndex -= 1;
        }
    }
}
