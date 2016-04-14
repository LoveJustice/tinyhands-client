export default class IrfController {
    constructor($stateParams, IrfService) {
        'ngInject';

        this.service = IrfService;

        this.flags = 0;
        this.form = {};
        this.irfId = $stateParams.id;
        this.page9 = {
            how_sure_was_trafficking_options: [
                { name: '1 - Not at all sure', val: 1 },
                { name: '2 - Unsure but suspects it', val: 2 },
                { name: '3 - Somewhat sure', val: 3 },
                { name: '4 - Very sure', val: 4 },
                { name: '5 - Absolutely sure', val: 5 }
            ]
        };
        this.sections = [];
        this.selectedSectionIndex = 0;

        this.addSections();
        this.getIrf();
    }

    addSections() {
        this.sections.push('app/irf/form/components/metaData/metaData.html');
        for (var pageNum = 1; pageNum <= 9; pageNum++) {
            this.sections.push(`app/irf/form/components/page${pageNum}/page${pageNum}.html`);
        }
    }

    getIrf() {
        this.service.getIrf(this.irfId).then((response) => {
            this.form = response.data;
            this.page9.how_sure_was_trafficking = this.page9.how_sure_was_trafficking_options[this.form.how_sure_was_trafficking - 1];
        });
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