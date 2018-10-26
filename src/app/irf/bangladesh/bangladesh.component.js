import MessageConstants from './constants.js';
import templateUrl from './bangladesh.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './bangladesh.less';
import IntercepteeModalController from './step-templates/interceptees/intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';

const IrfOtherData = require('../irfOtherData.js');

const DateTimeId = 4;
const OtherFamilyId = 82;
const OtherContactId = 92;

export class IrfBangladeshController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state) {
        'ngInject';

        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = IrfService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.stationId = this.stateParams.stationId;

        this.contacts = [['Hotel owner', 'Rickshaw driver', 'Taxi driver'], ['Bus driver', 'Church member', 'Other NGO'], ['Police', 'Subcomittee member']];
        this.family = [['Own brother', 'Own father', 'Own grandparent'], ['Own sister', 'Own mother', 'Own aunt/uncle']];
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.redFlagTotal = 0;
        this.selectedStep = 0;
        this.stepTemplates = [topBoxTemplate, groupTemplate, destinationTemplate, familyTemplate, signsTemplate, intercepteesTemplate, finalProceduresTemplate];
        this.errorMessages = [];
        this.warningMessages = [];

        this.getErrorData();
        this.getBangladeshIrf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
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
        activeErrors = activeErrors.concat(this.errorMessages);
        return activeErrors;
    }

    getWarningMessages() {
        let activeWarnings = [];
        activeWarnings = activeWarnings.concat(this.warningMessages);
        return activeWarnings;
    }

    getBangladeshIrf(countryId, stationId, id) {
        this.service.getIrf(countryId, stationId, id).then(response => {
            this.response = response.data;
            this.cards = response.data.cards[0].instances;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            if (this.questions[4].response.value === null) {
                this.questions[4].response.value = new Date();
            }
            this.setValuesForOtherInputs();
            if (id === null) {
                this.response.status = 'in-progress';
            }
        });
    }

    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, x => x.question_id === questionId).response;
    }

    incrementRedFlags(numberOfFlagsToAdd) {
        this.redFlagTotal += numberOfFlagsToAdd;
    }

    openIntercepteeModal(responses = [], isAdd = false, idx = null) {
        this.modalActions = [];
        if (isAdd) {
            responses.push({
                question_id: 7,
                response: {},
            });
            responses.push({
                question_id: 8,
                response: {},
            });
            responses.push({
                question_id: 9,
                response: {
                    gender: {},
                    name: {},
                    age: {},
                    address1: {
                        id: null,
                        name: '',
                    },
                    address2: {
                        id: null,
                        name: '',
                    },
                    phone: {},
                    nationality: {},
                },
            });
            responses.push({
                question_id: 11,
                response: {
                    value: false,
                },
            });
        }
        this.$uibModal
            .open({
                bindToController: true,
                controller: IntercepteeModalController,
                controllerAs: 'IntercepteeModalController',
                resolve: {
                    isAdd: () => isAdd,
                    questions: () => _.keyBy(responses, x => x.question_id),
                    isViewing: () => this.isViewing,
                    modalActions: () => this.modalActions,
                },
                size: 'lg',
                templateUrl: intercepteeModalTemplate,
            })
            .result.then(() => {
                if (isAdd) {
                    this.cards.push({
                        responses,
                    });
                } else if (this.modalActions.indexOf('removeCard') > -1 && idx !== null) {
                    this.cards.splice(idx, 1);
                }
            });
    }

    save() {
        this.response.status = 'in-progress';
        this.getValuesForOtherInputs();
        this.questions[144].response.value = this.redFlagTotal;
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then(
            response => {
                this.response = response.data;
                this.cards = response.data.cards[0].instances;
                this.responses = response.data.responses;
                this.questions = _.keyBy(this.responses, x => x.question_id);
                this.setValuesForOtherInputs();
                if (this.stateParams.id === null) {
                    this.stateParams.id = response.data.id;
                }
                this.state.go('irfNewList');
            },
            error => {
                this.errorMessages = error.data.errors;
                this.warningMessages = error.data.warnings;
            }
        );
        this.messagesEnabled = false;
    }

    setupFlagListener() {
        this.$scope.$on('flagTotalCheck', (event, flagData) => {
            this.incrementRedFlags(flagData.numberOfFlagsToAdd);
        });
    }

    isString(val) {
        return typeof val === 'string';
    }
    getScannedFormUrl(url_segment) {
        var newUrl = new URL(url_segment, this.constants.BaseUrl).href;
        return newUrl;
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        this.otherData = new IrfOtherData(this.questions);
        this.otherData.setRadioButton(this.contacts, OtherContactId);
        this.otherData.setRadioButton(this.family, OtherFamilyId);
    }

    getValuesForOtherInputs() {
        this.otherData.updateResponses();
    }

    showIgnoreWarningsCheckbox() {
        return (this.messagesEnabled && this.getWarningMessages().length > 0) || this.ignoreWarnings;
    }

    submit() {
        this.saved_status = this.response.status;
        this.getValuesForOtherInputs();
        this.questions[144].response.value = this.redFlagTotal;
        this.errorMessages = [];
        this.warningMessages = [];
        this.response.status = 'approved';
        if (this.ignoreWarnings) {
            this.response.ignore_warnings = 'True';
        } else {
            this.response.ignore_warnings = 'False';
        }
        this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then(
            response => {
                this.response = response.data;
                this.cards = response.data.cards[0].instances;
                this.responses = response.data.responses;
                this.questions = _.keyBy(this.responses, x => x.question_id);
                this.setValuesForOtherInputs();
                if (this.stateParams.id === null) {
                    this.stateParams.id = response.data.id;
                }
                this.state.go('irfNewList');
            },
            error => {
                this.errorMessages = error.data.errors;
                this.warningMessages = error.data.warnings;
                this.response.status = this.saved_status;
            }
        );

        this.messagesEnabled = true;
    }

    watchMessages() {
        this.$scope.$watch(
            () => this.cards,
            (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    this.getErrorMessages();
                }
            }
        );
        this.$scope.$watch(
            () => this.redFlagTotal,
            (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    this.getWarningMessages();
                }
            }
        );
    }
}

export default {
    templateUrl,
    controller: IrfBangladeshController,
};
