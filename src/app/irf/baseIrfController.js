import {BaseFormController} from '../baseFormController.js';

export class BaseIrfController extends BaseFormController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state) {
        'ngInject';
        super($scope, $stateParams);

        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = IrfService;
        this.state = $state;

        this.getIrf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    getIrf(countryId, stationId, id) {
    	this.service.getFormConfig(this.stateParams.formName).then ((response) => {
    		this.config = response.data;
    		this.service.getIrf(countryId, stationId, id).then((response) => {
    		    this.processResponse(response, id);
            });
    	});
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }
    
    getScannedFormUrl(url) {
        return new URL(url, this.constants.BaseUrl).href;
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
                config: () => config
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
    	this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
   		 this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
           	 this.stateParams.id = response.data.id;
            }
            this.state.go('irfNewList');
        }, (error) => {
        	this.set_errors_and_warnings(error.data);
           });
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

    showIgnoreWarningsCheckbox() {
        return (this.messagesEnabled && this.warningMessages.length > 0) || this.ignoreWarnings;
    }
    
    // Override in subclass for implementation specific features
    submitExtra() {
    }
    
    determineSubmitStatus() {
        let status = "approved";
        if (this.questions[819].response.value) {
            if (this.questions[819].response.value === 'Should Not have Intercepted or Should Not have Completed IRF (because there is Not a High Risk of Trafficking)') {
                status = "invalid";
            } else {
                status = 'second-verification';
            }
            if (!this.questions[821].response.value) {
                this.dateData.questions[821].value = new Date();
            }
        } else if (this.questions[814].response.value) {
            status = 'first-verification';
            if (!this.questions[817].response.value) {
                this.dateData.questions[817].value = new Date();
            }
        }
        return status;
    }

    submit() {
    	this.saved_status = this.response.status;
    	this.processPersons('Out');
    	this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
    	this.response.status = this.determineSubmitStatus();
    	this.outCustomHandling();
    	this.submitExtra();
    	this.errorMessages = [];
        this.warningMessages = [];
    	if (this.ignoreWarnings) {
    		this.response.ignore_warnings = 'True';
    	} else {
    		this.response.ignore_warnings = 'False';
    	}
    	this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
    		 this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
            	 this.stateParams.id = response.data.id;
             }
             this.state.go('irfNewList');
         }, (error) => {
        	 this.set_errors_and_warnings(error.data);
            });
    	
        this.messagesEnabled = true;
    }
}

export default {
	BaseIrfController
};
