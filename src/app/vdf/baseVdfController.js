import {BaseFormController} from '../baseFormController.js';

export class BaseVdfController extends BaseFormController {
    constructor($scope, $uibModal, constants, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = VdfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;

        this.vdfNumber = "";
        this.associatedPersons = [];

        this.getVdf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions[651].response.value.match(this.formNumberPattern) !== null);
    }
    
    number_change() {
        let question_id = 651;
        let vdfNumber = this.questions[question_id].response.value;
        if (this.vdfNumber !== vdfNumber) {
            this.vdfNumber = vdfNumber;
            if (vdfNumber === '') {
                this.associatedPersons = [];
            } else {
                this.service.getAssociatedPersons(this.stateParams.stationId, vdfNumber).then((response) => {
                    this.associatedPersons = response.data;
                });
                this.gospelQuestions = null;
                this.service.getGospelVerification(this.stateParams.stationId, vdfNumber).then((response) => {
                    this.gospelQuestions = _.keyBy(response.data.responses, (x) => x.question_id);
                });
            }
        }
    }

    getVdf(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getVdf(countryId, stationId, id).then((response) => {
                this.processResponse(response);
                this.number_change();
                if (this.stateParams.id !== null && this.questions[651].response.value !== null) {
                    this.relatedUrl = this.state.href('relatedForms', {
                        stationId: this.stateParams.stationId,
                        formNumber: this.questions[651].response.value
                    });
                }
                if (this.questions[651].response.value === null || this.questions[651].response.value === '') {
                    this.questions[651].response.value = this.response.station_code;
                }
                this.formNumberPattern = '^' + this.response.station_code + '[0-9]{3,}[A-Z]$';
                this.formNumberChange();
            });
        });
    }
    
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        let config = this.config[config_name];

        let starting_flag_count = the_card.flag_count;
        this.modalActions = [];
        this.$uibModal.open({
            bindToController: true,
            controller: theController,
            controllerAs: theControllerName,
            resolve: {
                isAdd: () => isAdd,
                card: () => the_card,
                isViewing: () => this.isViewing,
                modalActions: () => this.modalActions,
                config: () => config,
                parentController: () => this,
                associatedPersons: () => this.associatedPersons
            },
            size: 'lg',
            templateUrl: theTemplate,
        }).result.then(() => {
            let cards = this.getCardInstances(config_name);
            if (this.modalActions.indexOf('removeCard') > -1 && cardIndex !== null) {
                cards.splice(cardIndex, 1);
                this.redFlagTotal = this.redFlagTotal - starting_flag_count;
            } else {
                this.redFlagTotal = this.redFlagTotal + the_card.flag_count - starting_flag_count;
                if (isAdd) {
                    cards.push(the_card);
                }
            }
            this.autoSaveModified = true;
            this.autoSave();
        });
    }
    
    getUploadFileQuestions() {
        return [692];
    }
    
    // Override in subclass for implementation specific features
    saveExtra() {   
    }
   
    save() {
        this.response.status = 'in-progress';
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.service.submitVdf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
         this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
             this.stateParams.id = response.data.id;
            }
            this.state.go('vdfList');
        }, (error) => {
            this.set_errors_and_warnings(error.data);
           });
         this.messagesEnabled = false;
    }
    
    // Override in subclass for implementation specific features
    submitExtra() {
    }

    submit() {
        this.saved_status = this.response.status;
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.submitExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.response.status = 'approved';
        if (this.ignoreWarnings) {
            this.response.ignore_warnings = 'True';
        } else {
            this.response.ignore_warnings = 'False';
        }
        this.service.submitVdf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             this.state.go('vdfList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
    
    autoSaveInterval() {
        return 30000;
    }
    
    autoSaveHasMinimumData() {
        if (this.questions[651].response.value === null || this.questions[651].response.value === '') {
            return false;
        }
        return true;
    }
    
    doAutoSave() {
        this.response.status = 'in-progress';
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.spinner.show('Auto saving VDF...');
        this.service.submitVdf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response);
            this.number_change();
            if (this.stateParams.id !== null && this.questions[651].response.value !== null) {
                this.relatedUrl = this.state.href('relatedForms', {
                    stationId: this.stateParams.stationId,
                    formNumber: this.questions[651].response.value
                });
            }
            this.spinner.hide();
        }, (error) => {
            this.set_errors_and_warnings(error.data);
            this.spinner.hide();
           });
        this.messagesEnabled = false;
    }
}

export default {
    BaseVdfController
};
