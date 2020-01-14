import {BaseFormController} from '../baseFormController.js';
import printCardTemplate from './common/printCardTemplate.html';

export class BaseCifController extends BaseFormController {
    constructor($scope, $uibModal, constants, CifService, $stateParams, $state, $timeout, SpinnerOverlayService) {
        'ngInject';
        super($scope, $stateParams);

        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = CifService;
        this.state = $state;
        this.timeout = $timeout;
        this.relatedUrl = null;
        this.spinner = SpinnerOverlayService;
       
        this.cifNumber = "";
        this.associatedPersons = [];
        this.printCardTemplate = printCardTemplate;
        this.printMode = false;
        this.config = {};

        this.getCif(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    number_change() {
        let question_id = 287;
        let cifNumber = this.questions[question_id].response.value;
        if (this.cifNumber !== cifNumber) {
            this.cifNumber = cifNumber;
            if (cifNumber === '') {
                this.associatedPersons = [];
            } else {
                this.service.getAssociatedPersons(this.stateParams.stationId, cifNumber).then((response) => {
                    this.associatedPersons = response.data;
                });
            }
        }
    }

    getCif(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getCif(countryId, stationId, id).then((response) => {
                this.processResponse(response, id);
                this.number_change();
                if (this.stateParams.id !== null && this.questions[287].response.value !== null) {
                    this.relatedUrl = this.state.href('relatedForms', {
                        stationId: this.stateParams.stationId,
                        formNumber: this.questions[287].response.value
                    });
                }
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
                identificationTypes: () => this.getDefaultIdentificationTypes(),
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
    
    // Override in subclass for implementation specific features
    saveExtra() {	
    }
   
    save() {
    	this.response.status = 'in-progress';
    	this.processPersons('Out');
    	this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
    	this.outCustomHandling();
    	this.saveExtra();
    	this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
    	this.service.submitCif(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
   		 this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
           	 this.stateParams.id = response.data.id;
            }
            this.state.go('cifList');
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
    	this.processPersons('Out');
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
    	this.service.submitCif(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
    		 this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
            	 this.stateParams.id = response.data.id;
             }
             this.state.go('cifList');
         }, (error) => {
        	 this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
    	
        this.messagesEnabled = true;
    }
    
    getSimpleQuestions(config) {
        let simpleQuestions = config.Basic.concat(config.Date);
        for (let otherIdx in config.RadioOther) {
            if (config.Person.indexOf(config.RadioOther[otherIdx]) < 0) {
                simpleQuestions.push(config.RadioOther[otherIdx]);
            }
        }
        return simpleQuestions;
    }
    
    cifPrint() {
        this.printMode=true;
        this.timeout(() => {
            window.print();
            this.printMode=false;
        }, 1000);
    }

    autoSaveInterval() {
        return 30000;
    }

    autoSaveHasMinimumData() {
        if (this.questions[287].response.value === null || this.questions[287].response.value === '') {
            return false;
        }
        
        return true;
    }

    doAutoSave() {
        this.response.status = 'in-progress';
        this.processPersons('Out');
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.spinner.show('Auto saving CIF...');
        this.service.submitCif(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response, this.stateParams.id);
            this.number_change();
            if (this.stateParams.id !== null && this.questions[287].response.value !== null) {
                this.relatedUrl = this.state.href('relatedForms', {
                    stationId: this.stateParams.stationId,
                    formNumber: this.questions[287].response.value
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
	BaseCifController
};
