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

        this.contactValue = '';
        this.otherContactString = '';
        this.otherSign = false;
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

    setContactRadio() {
        const Contacts = ['Hotel owner', 'Rickshaw driver', 'Taxi driver', 'Bus driver', 'Church member', 'Other NGO', 'Police', 'Subcomittee member', ''];
        const OtherContactId = 92;
        this.contactValue = this.questions[OtherContactId].response.value;
        if (!_.includes(Contacts, this.contactValue)) {
            this.otherContactString = this.contactValue;
            this.contactValue = 'Other';
        }
    }

    setValuesForOtherInputs() {
        const DateTimeId = 4;
        const OtherRedFlagId = 31;
        const OtherSignId = 134;
        const OtherWebsiteId = 244;
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        let otherRedFlag = this.questions[OtherRedFlagId].response.value;
        let otherWebsite = this.questions[OtherWebsiteId].response.value;
        let otherSign = this.questions[OtherSignId].response.value;
        this.otherRedFlag = !!otherRedFlag;
        this.otherWebsite = !!otherWebsite;
        this.otherSign = !!otherSign;
        this.questions[OtherWebsiteId].response.value = otherWebsite === false ? '' : otherWebsite;
        this.questions[OtherRedFlagId].response.value = otherRedFlag === false ? '' : otherRedFlag;
        this.questions[OtherSignId].response.value = otherSign === false ? '' : otherSign;
        this.setContactRadio();
    }
}
export default {
    templateUrl,
    controller: IrfIndiaController
};