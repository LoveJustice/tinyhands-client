import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './india.less';
import IntercepteeModalController from './step-templates/interceptees/intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';

const DateTimeId = 4;
const InvalidIrfError = 0;
const IrfNumberId = 1;
const NoIntercepteesError = 1;
const NoRedFlagsWarning = 0;
const NoSignatureWarning = 1;
const OtherFamilyId = 82;
const OtherContactId = 92;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;
const SignedId = 151;

export class IrfIndiaController {
    constructor($scope, $uibModal, constants, IndiaService) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.constants = constants;
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
        this.ignoreWarnings = false;
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
        this.messagesEnabled = false;

        this.getErrorData();
        this.getIndiaIrf();
        this.getLocation();
        this.getStaff();
        this.watchMessages();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getErrorData() {
        this.IndiaService.getErrorMessages().then(response => {
            this.errorMessage = response.data[0].errors;
            this.warningMessage = response.data[0].warnings;
        });
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.cards = response.data.cards[0].instances;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
        });
    }

    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    getLocation() {
        this.IndiaService.getLocation().then(response => {
            this.location = response.data;
        });
    }

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, x => x.question_id === questionId).response;
    }

    getStaff() {
        this.IndiaService.getStaff().then(response => {
            this.staff = response.data;
        });
    }

    openIntercepteeModal(responses = [], isAdd = false) {
        if (isAdd) {
            responses.push({
                question_id: 7,
                response: {}
            });
            responses.push({
                question_id: 8,
                response: {}
            });
            responses.push({
                question_id: 9,
                response: {
                    gender: {},
                    name: {},
                    age: {},
                    address1: {},
                    address2: {},
                    phone: {},
                    nationality: {},
                }
            });
        }
        this.$uibModal.open({
            bindToController: true,
            controller: IntercepteeModalController,
            controllerAs: 'IntercepteeModalController',
            resolve: {
                isAdd: () => isAdd,
                questions: () => _.keyBy(responses, x => x.question_id)
            },
            size: 'lg',
            templateUrl: intercepteeModalTemplate,
        }).result.then(() => {
            if (isAdd) {
                this.cards.push({
                    responses
                });
            }
        });
    }

    save() {
        this.messagesEnabled = true;
        this.setErrorMessage();
        this.setWarningMessage();
    }

    setErrorMessage() {
        let activeErrors = [];
        if (this.messagesEnabled) {
            if (this.questions[IrfNumberId].response.value === '') {
                activeErrors.push(this.errorMessage[InvalidIrfError]);
            }
            if (_.size(this.cards) === 0) {
                activeErrors.push(this.errorMessage[NoIntercepteesError]);
            }
        }
        return activeErrors;
    }

    setOtherQuestionValues(valueId) {
        let valueSet = this.questions[valueId].response.value;
        this.questions[valueId].response.value = valueSet || '';
        return !!valueSet;
    }

    setRadio(items, valueId) {
        let flattenedItems = _.flattenDeep(items);
        let value = this.questions[valueId].response.value;
        if (!_.includes(flattenedItems, value) && value !== '') {
            this.questions[valueId].response.value = 'Other';
            return value;
        }
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        this.otherRedFlag = this.setOtherQuestionValues(OtherRedFlagId);
        this.otherSign = this.setOtherQuestionValues(OtherSignId);
        this.otherWebsite = this.setOtherQuestionValues(OtherWebsiteId);
        this.otherContactString = this.setRadio(this.contacts, OtherContactId);
        this.otherFamilyString = this.setRadio(this.family, OtherFamilyId);
    }

    setWarningMessage() {
        let activeWarnings = [];
        if (!this.ignoreWarnings && this.messagesEnabled) {
            if (!this.questions[SignedId].response.value) { //checks question 151 for answer
                activeWarnings.push(this.warningMessage[NoSignatureWarning]);
            }
            if (this.redFlagTotal === 0) { //checks for red flags
                activeWarnings.push(this.warningMessage[NoRedFlagsWarning]);
            }
        }
        return activeWarnings;
    }

    submit() {
        this.messagesEnabled = true;
        this.setErrorMessage();
        this.setWarningMessage();
    }

    watchMessages() {
        this.$scope.$watch(() => this.cards, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.setErrorMessage();
            }
        });
        this.$scope.$watch(() => this.redFlagTotal, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.setWarningMessage();
            }
        });
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};