import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';


export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.IndiaService = IndiaService;

        this.selectedStep = 1;
        this.stepTemplates = [
            topBoxTemplate,
            groupTemplate
        ];

        this.getIndiaIrf();
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.responses = response.data.responses;
        });
    }

    getQuestionIndexById(id) {
        return _.findIndex(this.responses, x => x.question_id == id);
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};