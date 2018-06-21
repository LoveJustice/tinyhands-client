import MessageConstants from './constants.js';
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
const IrfNumberId = 1;
const OtherFamilyId = 82;
const OtherContactId = 92;
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
        this.messagesEnabled = false;
        this.otherContactString = '';
        this.otherFamilyString = '';
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

        this.getErrorData();
        this.getIndiaIrf();
        this.setupFlagListener();
        this.watchMessages();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getErrorData() {
        this.errorMessageIrfNumber = MessageConstants.Errors.IrfNumber;
        this.errorMessageInterceptee = MessageConstants.Errors.Interceptee;
        this.warningMessageRedFlags = MessageConstants.Warnings.RedFlags;
        this.warningMessageNoSignature = MessageConstants.Warnings.NoSignature;
    }

    getErrorMessages() {
        let activeErrors = [];
        if (this.messagesEnabled) {
            if (this.questions[IrfNumberId].response.value === '') {
                activeErrors.push(this.errorMessageIrfNumber);
            }
            if (_.size(this.cards) === 0) {
                activeErrors.push(this.errorMessageInterceptee);
            }
        }
        return activeErrors;
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

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, x => x.question_id === questionId).response;
    }

    getWarningMessages() {
        let activeWarnings = [];
        if (!this.ignoreWarnings && this.messagesEnabled) {
            if (!this.questions[SignedId].response.value) {
                activeWarnings.push(this.warningMessageNoSignature);
            }
            if (this.redFlagTotal === 0) {
                activeWarnings.push(this.warningMessageRedFlags);
            }
        }
        return activeWarnings;
    }

    incrementRedFlags(numberOfFlagsToAdd) {
        this.redFlagTotal += numberOfFlagsToAdd;
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
        this.getErrorMessages();
        this.getWarningMessages();
    }



    setRadioOther(items, valueId) {
        let flattenedItems = _.flattenDeep(items);
        let value = this.questions[valueId].response.value;
        if (!_.includes(flattenedItems, value) && value !== '') {
            this.questions[valueId].response.value = 'Other';
            return value;
        }
    }

    setupFlagListener() {
        this.$scope.$on('flagTotalCheck', (event, flagData) => {
            this.incrementRedFlags(flagData.numberOfFlagsToAdd);
        });
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        this.otherContactString = this.setRadio(this.contacts, OtherContactId);
        this.otherFamilyString = this.setRadio(this.family, OtherFamilyId);
    }

    showIgnoreWarningsCheckbox() {
        return (this.messagesEnabled && this.getWarningMessages().length > 0) || this.ignoreWarnings;
    }

    submit() {
        this.messagesEnabled = true;
        this.getErrorMessages();
        this.getWarningMessages();
    }

    watchMessages() {
        this.$scope.$watch(() => this.cards, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.getErrorMessages();
            }
        });
        this.$scope.$watch(() => this.redFlagTotal, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.getWarningMessages();
            }
        });
    }
}

export default {
    templateUrl,
    controller: IrfIndiaController
};