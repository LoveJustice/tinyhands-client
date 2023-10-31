import {BaseFormController} from '../baseFormController.js';
import OtherData from '../otherData';
import DateData from '../dateData';
import CheckboxGroup from '../checkboxGroup';


export class BaseLfController extends BaseFormController {
    constructor($scope, $uibModal, LfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService, $timeout) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.incidentService = IncidentService;
        this.$uibModal = $uibModal;
        this.service = LfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.session = SessionService;
        this.timeout = $timeout;

	 	this.timer = {};
        this.lfNumber = "";
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

        this.getLf(this.stateParams.stationId, this.stateParams.id);
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions.lfTopLfNumber.response.value.match(this.formNumberPattern) !== null);
    }
    
    getRelatedFormsComplete() {
        this.excludeRelatedForm('LF', this.questions.lfTopLfNumber.response.value);
    }
    
    number_change() {
        let question_id = 'lfTopLfNumber';
        let lfNumber = this.questions[question_id].response.value;
        if (this.lfNumber !== lfNumber) {
            this.lfNumber = lfNumber;
            if (lfNumber === '') {
                this.associatedPersons = [];
            } else {
                this.service.getAssociatedPersons(this.stateParams.stationId, lfNumber).then((response) => {
                    this.associatedPersons = response.data;
                });
            }
        }
    }
    
    getLfComplete() {
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
    	this.getResponseOfQuestionByTag(card.responses, 'lfInformationIncident').value = this.stateParams.incidentId;
    	this.getResponseOfQuestionByTag(card.responses, 'lfInformationSourceType').value = 'Intercept';
    	let clearFields = ['lfInformationSourceTitle', 'lfInformationInterviewerName', 'lfInformationLocation','lfInformationDescription'];
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
    	this.getResponseOfQuestionByTag(card.responses, 'lfAssociationIncident').value = this.stateParams.incidentId;
    	this.getResponseOfQuestionByTag(card.responses, 'lfAssociationNarrative').value = '';
    	cards.push(card);
    }
    
    addEvaluationCard() {
    	let cards = this.getCardInstances('Evaluation');
    	let card = this.createCard('Evaluation');
    	this.getResponseOfQuestionByTag(card.responses, 'lfEvaluationIncident').value = this.stateParams.incidentId;
    	cards.push(card);
    }
    
     addLegalCard() {
    	let cards = this.getCardInstances('Legal');
    	let card = this.createCard('Legal');
    	this.getResponseOfQuestionByTag(card.responses, 'lfLegalIncident').value = this.stateParams.incidentId;
    	this.getResponseOfQuestionByTag(card.responses, 'lfLegalCrimesCharged').value = '';
    	this.getResponseOfQuestionByTag(card.responses, 'lfLegalLocationLastNotes').value = '';
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
    
    getAllIncidentNames() {
    	if (this.incidentNumber) {
    		let allIncidents = [this.incidentNumber];
    		if (this.associatedIncidents) {
    			for (let idx in this.associatedIncidents) {
    				allIncidents.push(this.associatedIncidents[idx].incident_number);
    			}
    		}
    		this.getIncidentNames(allIncidents);
    	}
    }

    getLf(stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getLf(null, stationId, id).then((response) => {
                this.processResponse(response);
                
                if (this.stateParams.id !== null && this.questions.lfTopLfNumber.response.value !== null) {
                    this.relatedUrl = this.state.href('relatedForms', {
                        stationId: this.stateParams.stationId,
                        formNumber: this.questions.lfTopLfNumber.response.value
                    });
                }
                
                this.getLfComplete();
                
                if (this.questions.lfTopLfNumber.response.value === null || this.questions.lfTopLfNumber.response.value === '') {
                	this.incidentService.getIncident(this.stateParams.incidentId).then((response) => {
                		this.incidentNumber = response.data.incident_number;
                		this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
            			this.getIncidentNames([this.incidentNumber]);
                		this.questions.lfTopLfNumber.response.value = this.incidentNumber;
                		this.formNumberPattern = '^' + this.incidentNumber + '[A-Z]{1,2}$';
                		this.formNumberChange();
                		this.number_change();
                	});
	            } else {
	            	this.incidentNumber = this.getIncidentNumberFromFormNumber(this.questions.lfTopLfNumber.response.value);
	            	this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
            		this.getIncidentNames([this.incidentNumber]);
	            	this.formNumberPattern = '^' + this.incidentNumber+ '[A-Z]{1,2}$';
	                this.formNumberChange();
	                this.number_change();
	            }
	            
	            if (id) {
	            	this.service.getAssociatedIncidents(id).then((response) => {
	            		this.associatedIncidents = response.data;
	            		this.getAllIncidentNames();
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
	            
	            if (this.questions.lfTopMergedPerson.response.age.value) {
	            	// Make age value of string so it works with the dropdown
	            	this.questions.lfTopMergedPerson.response.age.value = '' + this.questions.lfTopMergedPerson.response.age.value;
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
    
    existingLf() {
    }
    
    newLf() {
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
                	if (config_name === 'Association') {
                		this.getResponseOfQuestionByTag(the_card.responses, 'lfAssociationIncident').value = this.stateParams.incidentId;
                	}
                    cards.push(the_card);
                }
            }
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
    	
    	let locationFields = [
    		{cardField:'lfInformationPlace', mainField:'lfMergedPlace'}, 
    		{cardField:'lfInformationPlaceKind', mainField:'lfMergedPlaceKind'}, 
    		{cardField:'lfInformationPlaceDetail', mainField:'lfMergedPlaceDetail'}, 
    		{cardField:'lfInformationLatitude', mainField:'lfMergedLatitude'}, 
    		{cardField:'lfInformationLongitude', mainField:'lfMergedLongitude'}, 
    		{cardField:'lfInformationSignboard', mainField:'lfMergedSignboard'}, 
    		{cardField:'lfInformationPhone', mainField:'lfMergedPhone'}, 
    		{cardField:'lfInformationLocation', mainField:'lfMergedLocationInTown'}, 
    		{cardField:'lfInformationColor', mainField:'lfMergedColor'}, 
    		{cardField:'lfInformationNumberOfLevels', mainField:'lfMergedNumberOfLevels'}, 
    		{cardField:'lfInformationDescription', mainField:'lfMergedDescription'}, 
    		{cardField:'lfInformationLandmarks', mainField:'lfMergedLandmarks'}];
    	let cards = this.getCardInstances('Information');
    	for (let idx in locationFields) {
			let cardFieldName = locationFields[idx].cardField;
			let mainFieldName = locationFields[idx].mainField;
			
    		let current = this.questions[mainFieldName].response.value;
    		if (current) {
	    		let found = false;
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, cardFieldName);
	    			if (response.value === current) {
	    				found = true;
	    				break;
	    			}
	    		}
	    		if (!found) {
	    			if (isDelete) {
	    				this.questions[mainFieldName].response.value = null;
	    			} else {
	    				this.questions[mainFieldName].response.value = this.currentCard.questions[cardFieldName].response.value;
	    			}
	    		}
    		}
    		if (!this.questions[mainFieldName].response.value) {
	    		for (let cardIdx in cards) {
	    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, cardFieldName);
	    			if (response.value) {
	    				this.questions[mainFieldName].response.value = response.value;
	    				break;
	    			}
	    		}
    		}
    	}
    	
    	let current = this.questions.lfMergedAddress.response;
    	let found = false;
    	for (let cardIdx in cards) {
			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'lfInformationAddress');
			if (response === current) {
				found = true;
				break;
			}
		}
		if (!found) {
			if (isDelete) {
				this.questions.lfMergedAddress.response.value = null;
			} else {
				this.questions.lfMergedAddress.response = this.currentCard.questions.lfInformationAddress.response;
			}
		}
		if (!this.questions.lfMergedAddress.response) {
    		for (let cardIdx in cards) {
    			let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, 'lfInformationAddress');
    			if (response) {
    				this.questions.mainFieldName.response = response;
    				break;
    			}
    		}
		}
    }
    
    leaveCard(container) {
    	container.otherData.updateResponses();
        container.dateData.updateResponses();
        container.checkboxGroup.updateResponses();
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
    	let locationFields = ['lfInformationPlace', 'lfInformationPlaceKind', 'lfInformationPlaceDetail','lfInformationAddress',
    			'lfInformationLatitude','lfInformationLongitude','lfInformationSignboard','lfInformationPhone','lfInformationLocation',
    			'lfInformationColor','lfInformationNumberOfLevels', 'lfInformationDescription', 'lfInformationLandmarks'];
    	let cards = this.getCardInstances('Information');
    	for (let idx in locationFields) {
			let fieldName = locationFields[idx];
			this.mergeOptions[fieldName] = [];
			for (let cardIdx in cards) {
				let response = this.getResponseOfQuestionByTag(cards[cardIdx].responses, fieldName);
				let value = '';
				if (fieldName === 'lfInformationAddress') {
					value = response;
				} else {
					value = response.value;
				}
    			if (value) {
    			    if (!this.valueInList(value, this.mergeOptions[fieldName])) {
    					this.mergeOptions[fieldName].push(value);
    				}
    			}
			}
			
		}
		
		this.mergedAddressString = '';
		if (this.questions.lfMergedAddress.response) {
			this.mergedAddressString = this.questions.lfMergedAddress.response.address;
		}
    }
    
    addressChanged() {
    	if ('lfInformationAddress' in this.mergeOptions) {
    		for (let idx in this.mergeOptions.lfInformationAddress) {
    			if (this.mergeOptions.lfInformationAddress[idx].address === this.mergedAddressString) {
    				this.questions.lfMergedAddress.response.value = this.mergeOptions.lfInformationAddress[idx];
    				break;
    			}
    		}
    	}
    }
    
    createForm(incident) {
    	this.associatedIncidents.push(incident);
    	this.associatedIncidentsUpdate = true;
    	this.getAllIncidentNames();
    }
    
    removeIncident(index) {
    	if (index >= 0 && index < this.associatedIncidents.length) {
    		let selected = this.associatedIncidents[index];
    		if (selected.confirmedDelete) {
	            this.associatedIncidents.splice(index,1);
	            this.associatedIncidentsUpdate = true;
	            this.getAllIncidentNames();
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
        this.service.submitLf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
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
            this.state.go('lfList');
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
        this.service.submitLf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
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
             this.state.go('lfList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
}

export default {
    BaseLfController
};
