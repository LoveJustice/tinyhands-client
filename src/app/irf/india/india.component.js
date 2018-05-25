import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';


export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.IndiaService = IndiaService;

        this.selectedStep = 0;
        this.stepTemplates = [
            topBoxTemplate
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