import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';

const DateTimeId = 4;
const FamilyId = 82;
const OtherRedFlagId = 31;
const OtherWebsiteId = 244;

export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.IndiaService = IndiaService;

        this.familyArray = [['Own brother', 'Own father', 'Own grandparent'], ['Own sister', 'Own mother', 'Own aunt/uncle']];
        this.familyValue = '';
        this.otherFamily = '';
        this.otherFamilyString = '';
        this.otherRedFlag = false;
        this.otherWebsite = false;
        this.selectedStep = 3;
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
        this.getLocation();
        this.getStaff();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
        });
    }

    getLocation() {
        this.IndiaService.getLocation().then(response => {
            this.location = response.data;
        });
    }

    getQuestionIndexById(id) {
        return _.findIndex(this.responses, x => x.question_id === id);
    }

    getStaff() {
        this.IndiaService.getStaff().then(response => {
            this.staff = response.data;
        });
    }

    setFamilyRadio() {
        let flattenFamily = _.flattenDeep(this.familyArray);
        this.familyValue = this.questions[FamilyId].response.value;
        if (!_.includes(flattenFamily, this.familyValue) && this.familyValue !== '') {
            this.otherFamilyString = this.familyValue;
            this.familyValue = 'Other';
        }
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        let otherRedFlag = this.questions[OtherRedFlagId].response.value;
        let otherWebsite = this.questions[OtherWebsiteId].response.value;
        let otherFamily = this.questions[FamilyId].response.value;
        this.otherRedFlag = !!otherRedFlag;
        this.otherWebsite = !!otherWebsite;
        this.otherFamily = !!otherFamily;
        this.questions[OtherWebsiteId].response.value = otherWebsite === false ? '' : otherWebsite;
        this.questions[OtherRedFlagId].response.value = otherRedFlag === false ? '' : otherRedFlag;
        this.questions[FamilyId].response.value = otherFamily === false ? '' : otherFamily;
        this.setFamilyRadio();
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};