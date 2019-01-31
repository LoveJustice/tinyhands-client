const OtherData = require('../otherData.js');
const DateData = require('../dateData.js');

export class BaseIrfController {
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

        this.response = {status:'in-progress'};
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.redFlagTotal = 0;
        this.selectedStep = 0;
       
        this.errorMessages = [];
        this.warningMessages = [];

        this.getIrf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        this.setupFlagListener();
    }
    
    getErrorMessages() {
    	return this.errorMessages;
    }
    
    getWarningMessages() {
    	return this.warningMessages;
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getIrf(countryId, stationId, id) {
    	this.service.getFormConfig(this.stateParams.formName).then ((response) => {
    		this.config = response.data
    		this.service.getIrf(countryId, stationId, id).then((response) => {
            	this.response = response.data;
                this.responses = response.data.responses;
                this.questions = _.keyBy(this.responses, (x) => x.question_id);
                for (let idx=0; idx < this.response.cards.length; idx++) {
                	for (let idx1=0; idx1 < this.response.cards[idx].instances.length; idx1++) {
                		this.redFlagTotal += this.response.cards[idx].instances[idx1].flag_count;
                	}
                }

                this.inCustomHandling();
                if (id === null) {
                	this.response.status = 'in-progress';
                }
            });
    	});
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }
    
    inCustomHandling() {
    	this.setValuesForOtherInputs();
    	this.setValuesForDateInputs();
    }
    
    outCustomHandling() {
    	this.otherData.updateResponses();
    	this.dateData.updateResponses();
    }
    
    setValuesForOtherInputs() {
    	this.otherData = new OtherData(this.questions);
    	if (this.config.hasOwnProperty('RadioOther')) {
    		for (let idx=0; idx < this.config.RadioOther.length; idx++) {
    			let questionId = this.config.RadioOther[idx];
    			this.otherData.setRadioButton(this.config.RadioItems[questionId], questionId);
    		}
    	}
    }
    
    setValuesForDateInputs() {
    	this.dateData = new DateData(this.questions);
    	if (this.config.hasOwnProperty('Date')) {
    		for (let idx=0; idx < this.config.Date.length; idx++) {
    			let questionId = this.config.Date[idx];
    			this.dateData.setDate(questionId,'basic');
    		}
    	}
    	if (this.config.hasOwnProperty('Person')) {
    		for (let idx=0; idx < this.config.Person.length; idx++) {
    			let questionId = this.config.Person[idx];
    			this.dateData.setDate(questionId,'person');
    		}
    	}
    	
    }
    
   

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, (x) => x.question_id === questionId).response;
    }

    incrementRedFlags(numberOfFlagsToAdd) {
        this.redFlagTotal += numberOfFlagsToAdd;
    }
    
    commonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
    	let config = this.config[config_name];
    	if (isAdd) {
    		the_card = {
    				storage_id:null,
    				flag_count:0,
    				responses:[]
    		};
    		let indexQuestion = -1;
    		let lastIndex = 0;
    		if (config.hasOwnProperty('IndexQuestion')) {
    			indexQuestion = config.IndexQuestion;
    			let cards = this.getCardInstances(config_name);
    			
    			for (let idx=0; idx < cards.length; idx++) {
    	    		let card = cards[idx];
    	    		let value = null;
    	    		for (let respIdx=0; respIdx < card.responses.length; respIdx++) {
    	    			if (card.responses[respIdx].question_id === indexQuestion) {
    	    				value = card.responses[respIdx].response.value;
    	    				break;
    	    			}
    	    		}
    	    		if (value !== null && value !== '') {
    	    			lastIndex = value;
    	    		}
    	    	}
    			
    		}
    		if (config.hasOwnProperty('Person')) {
    			for (let idx=0; idx < config.Person.length; idx++) {
    				the_card.responses.push({
    	    			question_id: config.Person[idx],
    	    			response: {
    	                    gender: {},
    	                    name: {},
    	                    age: {},
    	                    birthdate:{},
    	                    address1: {
    	                    	id: null,
    	                    	name: ""
    	                    },
    	                    address2: {
    	                    	id: null,
    	                    	name: ""
    	                    },
    	                    phone: {},
    	                    nationality: {},
    	                }
    	    		});
    			}
    		}
    		if (config.hasOwnProperty('Address')) {
    			for (let idx=0; idx < config.Address.length; idx++) {
    				the_card.responses.push({
    					question_id: config.Address[idx],
    					response: {
	    	    			address1: {
	    	                	id: null,
	    	                	name: ""
	    	                },
	    	                address2: {
	    	                	id: null,
	    	                	name: ""
	    	                }
    					}
    	    		});
    			}
    		}
    		if (config.hasOwnProperty('Basic')) {
    			for (let idx=0; idx < config.Basic.length; idx++) {
    				if (config.Basic[idx] === indexQuestion) {
    					the_card.responses.push({question_id: config.Basic[idx], response: {value: lastIndex+1}});
    				} else {
    					the_card.responses.push({question_id: config.Basic[idx], response: {value:null}});
    				}
    			}
    		}
    		if (config.hasOwnProperty('Date')) {
    			for (let idx=0; idx < config.Date.length; idx++) {
					the_card.responses.push({question_id: config.Date[idx], response: {value:null}});
    			}
    		}
    		if (config.hasOwnProperty('RadioOther')) {
    			for (let idx=0; idx < config.RadioOther.length; idx++) {
					the_card.responses.push({question_id: config.RadioOther[idx], response: {value:null}});
    			}
    		}
    	}
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
    
    set_errors_and_warnings(response) {
    	if (response.errors != null) {
    		if (response.errors instanceof Array) {
    			this.errorMessages = response.errors;
    		} else {
    			this.errorMessages = [response.errors];
    		}
    	} else {
    		this.errorMessages = [];
    	}
    	if (response.warnings != null) {
    		if (response.warnings instanceof Array) {
    			this.warningMessages = response.warnings;
    		} else {
    			this.warningMessages = [response.warnings];
    		}
    	} else {
    		this.warningMessages = [];
    	}
    }
   
    save() {
    	this.response.status = 'in-progress';
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
    
    getCardInstances(constant_name) {
    	if (!this.config.hasOwnProperty(constant_name)) {
    		return [];
    	}
    	let category_id = this.config[constant_name].Category;
    	if (this.response !== null && this.response.cards !== null) {
	    	for (let idx=0; idx < this.response.cards.length; idx++) {
	    		if (this.response.cards[idx].category_id === category_id) {
	    			return this.response.cards[idx].instances;
	    		}
	    	}
    	}
    	
    	return [];
    }
}

export default {
	BaseIrfController
};
