import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './india.less';

const DateTimeId = 4;
const OtherFamilyId = 82;
const OtherContactId = 92;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;
const RedFlagTotalId = 144;

export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.IndiaService = IndiaService;

        this.contacts = [
            ['Hotel owner', 'Rickshaw driver', 'Taxi driver'],
            ['Bus driver', 'Church member', 'Other NGO'],
            ['Police', 'Subcomittee member']
        ];
        this.family = [
            ['Own brother', 'Own father', 'Own grandparent'],
            ['Own sister', 'Own mother', 'Own aunt/uncle']
        ];
        this.otherContactString = '';
        this.otherFamilyString = '';
        this.otherRedFlag = false;
        this.otherSign = false;
        this.otherWebsite = false;
        this.redFlagTotal = 0;
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
            this.redFlagTotal = this.questions[RedFlagTotalId].response.value;
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

    setRadio(items, valueId) {
        let flattenedItems = _.flattenDeep(items);
        let value = this.questions[valueId].response.value;
        if (!_.includes(flattenedItems, value) && value !== '') {
            this.questions[valueId].response.value = 'Other';
            return value;
        }
    }

    setOtherQuestionValues(valueId) {
        let valueSet = this.questions[valueId].response.value;
        this.questions[valueId].response.value = valueSet || '';
        return !!valueSet;
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        this.otherRedFlag = this.setOtherQuestionValues(OtherRedFlagId);
        this.otherSign = this.setOtherQuestionValues(OtherSignId);
        this.otherWebsite = this.setOtherQuestionValues(OtherWebsiteId);
        this.otherContactString = this.setRadio(this.contacts, OtherContactId);
        this.otherFamilyString = this.setRadio(this.family, OtherFamilyId);
    }

    updateRedFlags(flagValue, value) {
        if (value === true) {
            this.redFlagTotal += flagValue;
        } else {
            this.redFlagTotal -= flagValue;
        }
    }
}
export default {
    templateUrl,
    controller: IrfIndiaController
};