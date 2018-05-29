import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';


export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.IndiaService = IndiaService;

        this.otherWebsite = false;
        this.otherRedFlag = false;
        this.selectedStep = 0;
        this.stepTemplates = [
            topBoxTemplate,
            groupTemplate,
            destinationTemplate,
            familyTemplate,
            signsTemplate,
            intercepteesTemplate,
            finalProceduresTemplate
        ];

        this.getIndiaIrf();
        this.getStaff();
        this.getLocation();
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
        });
    }

    getQuestionIndexById(id) {
        return _.findIndex(this.responses, x => x.question_id === id);
    }

    setValuesForOtherInputs() {
        const DATE_TIME_ID = 4;
        this.questions[DATE_TIME_ID].response.value = this.formatDate(this.questions[DATE_TIME_ID].response.value);
        const OTHER_RED_FLAG_ID = 31;
        const OTHER_WEBSITE_ID = 244;
        let otherRedFlag = this.questions[OTHER_RED_FLAG_ID].response.value;
        let otherWebsite = this.questions[OTHER_WEBSITE_ID].response.value;
        this.otherRedFlag = !!otherRedFlag;
        this.otherWebsite = !!otherWebsite;
        this.questions[OTHER_WEBSITE_ID].response.value = otherWebsite === false ? '' : otherWebsite;
        this.questions[OTHER_RED_FLAG_ID].response.value = otherRedFlag === false ? '' : otherRedFlag;
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