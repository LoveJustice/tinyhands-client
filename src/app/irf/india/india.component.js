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
        this.getStaff();
        this.getLocation();
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.responses = response.data.responses;
            this.responses[this.getQuestionIndexById(4)].response.value = this.formatDate(this.responses[this.getQuestionIndexById(4)].response.value);
        });
    }

    getQuestionIndexById(id) {
        return _.findIndex(this.responses, x => x.question_id == id);
    }
    formatDate(UfcDate) {
        return new Date(UfcDate);
    }
    getStaff() {
        this.IndiaService.getStaff().then(response => {
            this.staff = response.data;
        });
    }
    getLocation() {
        this.IndiaService.getLocation().then(response => {
            this.location = response.data;
        });
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};