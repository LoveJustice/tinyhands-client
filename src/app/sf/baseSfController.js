import {BaseFormController} from '../baseFormController.js';
const OtherData = require('../otherData.js');
const DateData = require('../dateData.js');
const CheckboxGroup = require('../checkboxGroup.js');


export class BaseSfController extends BaseFormController {
    constructor($scope, $uibModal, SfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService, $timeout) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.incidentService = IncidentService;
        this.$uibModal = $uibModal;
        this.service = SfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.session = SessionService;
        this.timeout = $timeout;

	 	this.timer = {};
        this.sfNumber = "";
        this.associatedPersons = [];
        this.informationCard = "MERGED";
        this.currentCard = null;
        this.associationCard = null;
        this.legalCard = null;
        this.checkboxGroupLegal = null;
        this.dateDataLegal = null;
        this.stationId = this.stateParams.stationId;
        this.associatedIncidents = [];
        this.associatedIncidentsUpdate = false;
        this.goodFormNumber = false;
        
        this.mergeOptions = {};
        this.mergedAddressString = "";
        
        this.emptyList = [];

        this.getSf(this.stateParams.stationId, this.stateParams.id);
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions.sfTopSfNumber.response.value.match(this.formNumberPattern) !== null);
    }
    
    getRelatedFormsComplete() {
        this.excludeRelatedForm('SF', this.questions.sfTopSfNumber.response.value);
    }
    
    number_change() {
        let question_id = 'sfTopSfNumber';
        let sfNumber = this.questions[question_id].response.value;
        if (this.sfNumber !== sfNumber) {
            this.sfNumber = sfNumber;
            if (sfNumber === '') {
                this.associatedPersons = [];
            } else {
                this.service.getAssociatedPersons(this.stateParams.stationId, sfNumber).then((response) => {
                    this.associatedPersons = response.data;
                });
            }
        }
    }
    
    getSfComplete() {
    }
    
    resetCheckboxGroupInfo() {
    }
    
    getDefaultIdentificationTypes() {
    	return ['Passport', 'Other ID#'];
    }
    
    informationCardChange() {
    	if (this.currentCard) {
    		this.leaveCard(this.currentCard);
    		this.checkAndPopulateMerged(false);
    		
    	}
    	if (this.informationCard === 'MERGED') {
    		this.resetCheckboxGroupInfo();
    		this.buildMergeOptions();
    		this.currentCard = null;
    	} else {
    		let cards = this.getCardInstances('Information');
    		let infoCard = this.getInfoCardConfig();
    		this.currentCard = this.enterCard(cards[parseInt(this.informationCard)], infoCard.dateQuestions, infoCard.otherQuestions, infoCard.checkboxGroupQuestions);
    		this.confirmedDelete = false;
    	}
    }
    
    addInformationCard() {
    	let cards = this.getCardInstances('Information');
    	let card = this.createCard('Information');
    	this.getResponseOfQuestionByTag(card.responses, 'sfInformationIncident').value = this.stateParams.incidentId;
    	this.getResponseOfQuestionByTag(card.responses, 'sfInformationSourceType').value = 'Intercept';
    	let clearFields = ['sfInformationSourceTitle', 'sfInformationInterviewerName', 'sfInformationInterviewLocation'];
    	for (let idx in clearFields) {
    		this.getResponseOfQuestionByTag(card.responses, clearFields[idx]).value = '';
    	}
    	cards.push(card);
    	this.informationCard = '' + (cards.length - 1);
    	this.informationCardChange();
    }
    
    addAssociationCard() {
    	let cards = this.getCardInstances('Association');
    	let card = this.createCard('Association');
    	this.getResponseOfQuestionByTag(card.responses, 'sfAssociationIncident').value = this.stateParams.incidentId;
    	this.getResponseOfQuestionByTag(card.responses, 'sfAssociationNarrative').value = '';
    	cards.push(card);
    }
    
    addEvaluationCard() {
    	let cards = this.getCardInstances('Evaluation');
    	let card = this.createCard('Evaluation');
    	this.getResponseOfQuestionByTag(card.responses, 'sfEvaluationIncident').value = this.stateParams.incidentId;
    	cards.push(card);
    }
    
     addLegalCard() {
    	let cards = this.getCardInstances('Legal');
    	let card = this.createCard('Legal');
    	this.getResponseOfQuestionByTag(card.responses, 'sfLegalIncident').value = this.stateParams.incidentId;
    	this.getResponseOfQuestionByTag(card.responses, 'sfLegalCrimesCharged').value = '';
    	this.getResponseOfQuestionByTag(card.responses, 'sfLegalLocationLastNotes').value = '';
    	cards.push(card);
    }
    
    removeInformationCard() {
        if (this.currentCard && this.currentCard.confirmedDelete) {
        	let cards = this.getCardInstances('Information');
        	if (cards.length > 1 && this.informationCard !== 'MERGED') {
        		let cardIdx = parseInt(this.informationCard);
        		cards.splice(cardIdx,1);
        		this.informationCard = 'MERGED';
        		this.informationCardChange();
        	}
            
        }
        else {
            this.currentCard.confirmedDelete = true;
        }
    }
    
    removeEvaluationCard(idx) {
    	let cards = this.getCardInstances('Evaluation');
    	if (idx >= 0 && idx < cards.length) {
    		cards.splice(idx, 1);
    	}
    }
    
    getInfoCardConfig() {
    }

    getSf(stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getSf(null, stationId, id).then((response) => {
                this.processResponse(response);
                
                if (this.stateParams.id !== null && this.questions.sfTopSfNumber.response.value !== null) {
                    this.relatedUrl = this.state.href('relatedForms', {
                        stationId: this.stateParams.stationId,
                        formNumber: this.questions.sfTopSfNumber.response.value
                    });
                }
                
                this.getSfComplete();
                
                if (this.questions.sfTopSfNumber.response.value === null || this.questions.sfTopSfNumber.response.value === '') {
                	this.incidentService.getIncident(this.stateParams.incidentId).then((response) => {
                		this.incidentNumber = response.data.incident_number;
                		this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
            			this.getIncidentNames([this.incidentNumber]);
                		this.questions.sfTopSfNumber.response.value = this.incidentNumber;
                		this.formNumberPattern = '^' + this.incidentNumber + '[A-Z]{1,2}$';
                		this.formNumberChange();
                		this.number_change();
                	});
	            } else {
	            	this.incidentNumber = this.getIncidentNumberFromFormNumber(this.questions.sfTopSfNumber.response.value);
	            	this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
            		this.getIncidentNames([this.incidentNumber]);
	            	this.formNumberPattern = '^' + this.incidentNumber+ '[A-Z]{1,2}$';
	                this.formNumberChange();
	                this.number_change();
	            }
	            
	            if (id) {
	            	this.service.getAssociatedIncidents(id).then((response) => {
	            		this.associatedIncidents = response.data;
	            	});
	            	this.selectedStep = 1;
	            }
	            
	            let cards = this.getCardInstances('Information');
	            if (cards.length < 1) {
	            	this.addInformationCard();
	            }
	            else {
		            if (cards.length === 1) {
		            	this.informationCard = "0";
		            	let infoCard = this.getInfoCardConfig();
		            	this.currentCard = this.enterCard(cards[0], infoCard.dateQuestions, infoCard.otherQuestions, infoCard.checkboxGroupQuestions);
		            } else {
		            	this.informationCard = "MERGED";
		            	this.currentCard = null;
		            	this.resetCheckboxGroupInfo();
    					this.buildMergeOptions();
		            }
	            }
	            
	            if (this.questions.sfTopMergedPerson.response.age.value) {
	            	// Make age value of string so it works with the dropdown
	            	this.questions.sfTopMergedPerson.response.age.value = '' + this.questions.sfTopMergedPerson.response.age.value;
	            }
	            
	            cards = this.getCardInstances('Association');
	            if (cards.length < 1) {
	            	this.addAssociationCard();
	            }
	            this.associationCard = cards[0];
	            
	            cards = this.getCardInstances('Legal');
	            if (cards.length < 1) {
	            	this.addLegalCard();
	            }
	            this.legalCard = cards[0];
	            this.enterLegalCard();
            });
        });
    }
    
    existingSf() {
    }
    
    newSf() {
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
    
    enterCard(card, dateQuestions, otherQuestions, checkboxGroupQuestions) {
    	let container = {
    		theCard: card,
    		questions: _.keyBy(card.responses, (x) => x.question_tag),
    	};
    	
    	container.dateData = new DateData(container.questions);
    	for (let idx=0; idx < dateQuestions.length; idx++) {
    		container.dateData.setDate(dateQuestions[idx].tag, dateQuestions[idx].type);
    	}
    	
    	container.otherData = new OtherData(container.questions);
    	container.otherDataItems = {};
        for (let idx=0; idx < otherQuestions.length; idx++) {
            container.otherData.setRadioButton(otherQuestions[idx].radioItems, otherQuestions[idx].tag);
            container.otherDataItems[otherQuestions[idx].tag] = otherQuestions[idx].radioItems;
        }
        
        container.checkboxGroup = new CheckboxGroup();
        container.checkboxGroupItems = {};
        for (let idx=0; idx < checkboxGroupQuestions.length; idx++) {
        	for (let itemIdx=0; itemIdx < checkboxGroupQuestions[idx].items.length; itemIdx++) {
        		container.checkboxGroup.checkboxItem(checkboxGroupQuestions[idx].tag, checkboxGroupQuestions[idx].items[itemIdx]);
        	}
        	container.checkboxGroupItems[checkboxGroupQuestions[idx].tag] = checkboxGroupQuestions[idx].items;
        }
        container.checkboxGroup.initOriginalValues(container.questions);
        return container;
    }
    
    associatedPersonChange(person) {
    	if (this.currentCard) {
    		this.timer = this.timeout(() => {
            		this.currentCard.checkboxGroup.initOriginalValues(this.currentCard.questions);
       		}, 500);
    	}
    }
    
    checkAndPopulateMerged(isDelete) {
    	// Generic processing for simple person fields
    	let personFields = ['name','gender','birthdate','age','address','latitude','longitude',
    		'address_notes','phone','social_media','social_media_platform','nationality',
    		'occupation','appearance'];
    	let cards = this.getCardInstances('Information');
    	for (let idx in personFields) {
			let fieldName = personFields[idx];
			if (!(fieldName in this.questions.sfTopMergedPerson.response)) {
				this.questions.sfTopMergedPerson.response[fieldName] = {value:null};
			}
    		let current = this.questions.sfTopMergedPerson.response[fieldName].value;
    		if (current) {
	    		let found = false;
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
	    			if (response[fieldName].value === current) {
	    				found = true;
	    				break;
	    			}
	    		}
	    		if (!found) {
	    			if (isDelete) {
	    				this.questions.sfTopMergedPerson.response[fieldName].value = null;
	    			} else {
	    				this.questions.sfTopMergedPerson.response[fieldName].value = this.currentCard.questions.sfInformationPerson.response[fieldName].value;
	    				if (fieldName === 'age') {
	    					this.questions.sfTopMergedPerson.response[fieldName].value = '' + this.currentCard.questions.sfInformationPerson.response[fieldName].value;
	    				} else {
	    					this.questions.sfTopMergedPerson.response[fieldName].value = this.currentCard.questions.sfInformationPerson.response[fieldName].value;
	    				}
	    			}
	    		}
    		}
    		if (!this.questions.sfTopMergedPerson.response[fieldName].value) {
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
	    			if (!(fieldName in response)) {
	    				continue;
	    			}
	    			if (response[fieldName].value) {
	    				if (fieldName === 'age') {
	    					this.questions.sfTopMergedPerson.response[fieldName].value = '' + response[fieldName].value;
	    				} else {
	    					this.questions.sfTopMergedPerson.response[fieldName].value = response[fieldName].value;
	    				}
	    				break;
	    			}
	    		}
    		}
    	}
    	
    	// process roles - union values
    	let roleSet = [];
    	for (let cardIdx in cards) {
			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
			if (response.role.value) {
				let roleItems = response.role.value.split(';');
				for (let itemIdx in roleItems) {
					if (roleSet.indexOf(roleItems[itemIdx]) < 0) {
						roleSet.push(roleItems[itemIdx]);
					}
				}
			}
		}
		let newRoles = '';
		let sep = '';
		for (let idx in roleSet) {
			newRoles += sep + roleSet[idx];
			sep = ';';
		}
		this.questions.sfTopMergedPerson.response.role = {value:newRoles};
    	
    	// process person identifiers
    	let defaultTypes = this.getDefaultIdentificationTypes();
    	for (let idx in defaultTypes) {
    		if (!(defaultTypes[idx] in this.questions.sfTopMergedPerson.response.identifiers)) {
    			this.questions.sfTopMergedPerson.response.identifiers[defaultTypes[idx]] = {
		                        type: {value:defaultTypes[idx]},
		                        number: {value:""},
		                        location: {value:""}};
    		}
    		let current = this.questions.sfTopMergedPerson.response.identifiers[defaultTypes[idx]].number.value;
    		if (current) {
	    		let found = false;
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
	    			if (response.identifiers[defaultTypes[idx]].number.value === current) {
	    				found = true;
	    				break;
	    			}
	    		}
	    		if (!found) {
	    			if (isDelete) {
	    				this.questions.sfTopMergedPerson.response.identifiers[defaultTypes[idx]].number.value = '';
	    			} else {
	    				this.questions.sfTopMergedPerson.response.identifiers[defaultTypes[idx]].number.value = 
	    						this.currentCard.questions.sfInformationPerson.response.identifiers[defaultTypes[idx]].number.value;
	    			}
	    		}
    		}
    		
    		if (!this.questions.sfTopMergedPerson.response.identifiers[defaultTypes[idx]].number.value) {
    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
	    			if (response.identifiers[defaultTypes[idx]].number.value) {
	    				this.questions.sfTopMergedPerson.response.identifiers[defaultTypes[idx]].number.value =
	    						response.identifiers[defaultTypes[idx]].number.value;
	    				break;
	    			}
	    		}
    		}
    	}
    	
    	// process non-person questions
		let mergeQuestion = [{merge:'sfTopMergedVehicle', source:'sfInformationVehicle'},{merge:'sfTopMergedPlateNumber',source:'sfInformationPlateNumber'}];
		for (let idx in mergeQuestion) {
			let current = this.questions[mergeQuestion[idx].merge].response.value;
			if (current) {
	    		let found = false;
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, mergeQuestion[idx].source);
	    			if (response.value === current) {
	    				found = true;
	    				break;
	    			}
	    		}
	    		if (!found) {
	    			if (isDelete) {
	    				this.questions[mergeQuestion[idx].merge].response.value = null;
	    			} else {
	    				this.questions[mergeQuestion[idx].merge].response.value = this.currentCard.questions[mergeQuestion[idx].source].response.value;
	    			}
	    		}
	    	}
	    	if (!this.questions[mergeQuestion[idx].merge].response.value) {
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, mergeQuestion[idx].source);
	    			if (response.value) {
	    				this.questions[mergeQuestion[idx].merge].response.value = response.value;
	    				break;
	    			}
	    		}
	    	}
		}
    }
    
    leaveCard(container) {
    	container.otherData.updateResponses();
        container.dateData.updateResponses();
        container.checkboxGroup.updateResponses();
        if (!this.questions.sfTopMergedPerson.response.link_id && this.currentCard.questions.sfInformationPerson.response.link_id) {
            this.questions.sfTopMergedPerson.response.link_id = this.currentCard.questions.sfInformationPerson.response.link_id;
        }
    }
    
    enterLegalCard() {
		this.checkboxGroupLegal = new CheckboxGroup();
		for (let question_tag in this.legalCheckboxGroupQuestions) {
			for (let idx in this.legalCheckboxGroupQuestions[question_tag]) {
				let entry = this.legalCheckboxGroupQuestions[question_tag][idx];
				if (entry.type === 'checkbox-group') {
					this.checkboxGroupLegal.checkboxItem(question_tag, entry.value);
				}
			}
		}
		let legalQuestions =  _.keyBy(this.legalCard.responses, (x) => x.question_tag);
		this.checkboxGroupLegal.initOriginalValues(legalQuestions);
		
		this.dateDataLegal = new DateData(legalQuestions);
		for (let idx in this.legalDateData) {
    		this.dateDataLegal.setDate(this.legalDateData[idx], 'basic');
    	}
    }
    
    saveLegalCard() {
    	this.checkboxGroupLegal.updateResponses();
    	this.dateDataLegal.updateResponses();
    }
    
    valueInList(newValue, optionList) {
        let addressCompare = false;
        if (newValue.hasOwnProperty('address')) {
            addressCompare = true;
        }
        for (let optionIdx in optionList) {
            if (addressCompare) {
                if (optionList[optionIdx].address === newValue.address &&
                        optionList[optionIdx].latitude === newValue.latitude && 
                        optionList[optionIdx].longitude === newValue.longitude) {
                    return true;
                }
            } else {
                if (_.isEqual(optionList[optionIdx], newValue)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    buildMergeOptions() {
    	this.mergeOptions = {};
    	let personFields = ['name','gender','birthdate','age','address','latitude','longitude',
    		'address_notes','phone','social_media','social_media_platform','nationality',
    		'occupation','appearance'];
    	let cards = this.getCardInstances('Information');
    	for (let idx in personFields) {
			let fieldName = personFields[idx];
			this.mergeOptions[fieldName] = [];
			for (let cardIdx in cards) {
				let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
    			if (!(fieldName in response)) {
    				continue;
    			}
    			if (response[fieldName].value) {
    			    if (!this.valueInList(response[fieldName].value, this.mergeOptions[fieldName])) {
    					this.mergeOptions[fieldName].push(response[fieldName].value);
    				}
    			}
			}
			
		}
		
		this.mergedAddressString = '';
		if (this.questions.sfTopMergedPerson.response.address.value) {
			this.mergedAddressString = this.questions.sfTopMergedPerson.response.address.value.address;
		}
		
		let defaultTypes = this.getDefaultIdentificationTypes();
    	for (let idx in defaultTypes) {
    		let fieldName = defaultTypes[idx];
    		this.mergeOptions['identifiers.' + fieldName] = [];
    		for (let cardIdx in cards) {
				let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'sfInformationPerson');
    			if (!(fieldName in response.identifiers)) {
    				continue;
    			}
    			if (response.identifiers[fieldName].number.value) {
    				if (this.mergeOptions['identifiers.' + fieldName].indexOf(response.identifiers[fieldName].number.value) < 0) {
    					this.mergeOptions['identifiers.' + fieldName].push(response.identifiers[fieldName].number.value);
    				}
    			}
			}
    	}
    	
    	let mergeQuestion = [{merge:'sfTopMergedVehicle', source:'sfInformationVehicle'},{merge:'sfTopMergedPlateNumber',source:'sfInformationPlateNumber'}];
		for (let idx in mergeQuestion) {
			this.mergeOptions[mergeQuestion[idx].merge] = [];
			for (let cardIdx in cards) {
				let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, mergeQuestion[idx].source); 
				if (response.value) {
					this.mergeOptions[mergeQuestion[idx].merge].push(response.value);
				}
			}
		}
    }
    
    addressChanged() {
    	if ('address' in this.mergeOptions) {
    		for (let idx in this.mergeOptions.address) {
    			if (this.mergeOptions.address[idx].address === this.mergedAddressString) {
    				this.questions.sfTopMergedPerson.response.address.value = this.mergeOptions.address[idx];
    				break;
    			}
    		}
    	}
    }
    
    createForm(incident) {
    	this.associatedIncidents.push(incident);
    	this.associatedIncidentsUpdate = true;
    }
    
    removeIncident(index) {
    	if (index >= 0 && index < this.associatedIncidents.length) {
    		let selected = this.associatedIncidents[index];
    		if (selected.confirmedDelete) {
	            this.associatedIncidents.splice(index,1);
	            this.associatedIncidentsUpdate = true;
	        }
	        else {
	            selected.confirmedDelete = true;
	        }
		}
    }
    
    // Override in subclass for implementation specific features
    saveExtra() {   
    }
   
    save() {
        this.response.status = 'in-progress';
        if (this.currentCard) {
        	this.leaveCard(this.currentCard);
        }
        this.saveLegalCard();
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.service.submitSf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
         this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
             this.stateParams.id = response.data.id;
            }
            if (this.associatedIncidentsUpdate) {
             	let associatedIds = [];
             	for (let idx in this.associatedIncidents) {
             		associatedIds.push(this.associatedIncidents[idx].id);
             	}
             	this.service.setAssociatedIncidents(this.stateParams.id, associatedIds);
             }
            this.state.go('sfList');
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
        if (this.currentCard) {
        	this.leaveCard(this.currentCard);
        }
        this.saveLegalCard();
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
        this.service.submitSf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.setupQuestions(this.responses);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             if (this.associatedIncidentsUpdate) {
             	let associatedIds = [];
             	for (let idx in this.associatedIncidents) {
             		associatedIds.push(this.associatedIncidents[idx].id);
             	}
             	this.service.setAssociatedIncidents(this.stateParams.id, associatedIds);
             }
             this.state.go('sfList');
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
        if (this.questions.sfTopSfNumber.response.value === null || this.questions.sfTopSfNumber.response.value === '' || this.goodFormNumber == false) {
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
        this.spinner.show('Auto saving SF...');
        this.service.submitSf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response);
            if (this.stateParams.id !== null && this.questions.sfTopSfNumber.response.value !== null) {
                this.relatedUrl = this.state.href('relatedForms', {
                    stationId: this.stateParams.stationId,
                    formNumber: this.questions.sfTopSfNumber.response.value
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
    BaseSfController
};
