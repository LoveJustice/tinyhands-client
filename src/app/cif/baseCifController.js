
const CifOtherData = require('./cifOtherData.js');
const CifDateDate = require('./cifDateData.js');

export class BaseCifController {
    constructor($scope, $uibModal, constants, CifService, $stateParams, $state, idConstants) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = CifService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.idConstants = idConstants;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.stationId = this.stateParams.stationId;

        this.response = {status:'in-progress'};
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.otherContactString = '';
        this.otherFamilyString = '';
        this.redFlagTotal = 0;
        this.selectedStep = 0;
       
        this.errorMessages = [];
        this.warningMessages = [];

        this.getCif(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        this.setupFlagListener();
        this.watchMessages();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
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

    getCif(countryId, stationId, id) {
        this.service.getCif(countryId, stationId, id).then((response) => {
        	this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, (x) => x.question_id)
            for (let idx=0; idx < this.response.cards.length; idx++) {
            	for (let idx1=0; idx1 < this.response.cards[idx].instances.length; idx1++) {
            		this.redFlagTotal += this.response.cards[idx].instances[idx1].flag_count;
            	}
            }
            		
            if (this.questions[this.idConstants.MainPersonId].response.value === null) {
            	this.questions[this.idConstants.MainPersonId].response = {
            		"storage_id": null,
	                "name": {
	                    "value": ""
	                },
	                "address1": {
	                    "id": null,
	                    "name": ""
	                },
	                "address2": {
	                    "id": null,
	                    "name": ""
	                },
	                "phone": {
	                    "value": ""
	                },
	                "gender": {
	                    "value": ""
	                },
	                "age": {
	                    "value": null
	                },
	                "birthdate": {
	                	"value":""
	                },
	                "passport": {
	                    "value": ""
	                },
	                "nationality": {
	                    "value": ""
	                }
            	};
            }
            this.inCustomHandling();
            if (id === null) {
            	this.response.status = 'in-progress';
            }
        });
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
    	this.otherData = new CifOtherData(this.questions);
    	if (this.idConstants.hasOwnProperty('RadioOther')) {
    		for (let idx=0; idx < this.idConstants.RadioOther.length; idx++) {
    			let questionId = this.idConstants.RadioOther[idx];
    			this.otherData.setRadioButton(this.idConstants.RadioItems[questionId], questionId);
    		}
    	}
    }
    
    setValuesForDateInputs() {
    	this.dateData = new CifDateDate(this.questions);
    	if (this.idConstants.hasOwnProperty('Date')) {
    		for (let idx=0; idx < this.idConstants.Date.length; idx++) {
    			let questionId = this.idConstants.Date[idx];
    			this.dateData.setDate(questionId,'basic');
    		}
    	}
    	if (this.idConstants.hasOwnProperty('Person')) {
    		for (let idx=0; idx < this.idConstants.Person.length; idx++) {
    			let questionId = this.idConstants.Person[idx];
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
    	let config = this.idConstants[config_name];
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
    	    			if (card.responses[respIdx].question_id == indexQuestion) {
    	    				value = card.responses[respIdx].response.value;
    	    				break;
    	    			}
    	    		}
    	    		if (value != null && value != '') {
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
    				if (config.Basic[idx] == indexQuestion) {
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
   
    save() {
    	this.response.status = 'in-progress';
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
       	 this.errorMessages = error.data.errors;
            this.warningMessages = error.data.warnings;
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
        return (this.messagesEnabled && this.getWarningMessages().length > 0) || this.ignoreWarnings;
    }
    
    // Override in subclass for implementation specific features
    submitExtra() {
    }

    submit() {
    	this.saved_status = this.response.status;
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
        	 this.errorMessages = error.data.errors;
             this.warningMessages = error.data.warnings;
             this.response.status = this.saved_status;
            });
    	
        this.messagesEnabled = true;
    }
    
    getCardInstances(constant_name) {
    	if (!this.idConstants.hasOwnProperty(constant_name)) {
    		return [];
    	}
    	let category_id = this.idConstants[constant_name].Category
    	if (this.response != null && this.response.cards != null) {
	    	for (let idx=0; idx < this.response.cards.length; idx++) {
	    		if (this.response.cards[idx].category_id === category_id) {
	    			return this.response.cards[idx].instances;
	    		}
	    	}
    	}
    	
    	return [];
    }

    watchMessages() {
        this.$scope.$watch(() => this.redFlagTotal, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.getWarningMessages();
            }
        });
    }
}

export default {
	BaseCifController
};
