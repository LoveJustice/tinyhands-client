import {BaseFormController} from '../baseFormController.js';
const CheckboxGroup = require('../checkboxGroup.js');
const ConfirmModalController = require('./confirmModalController.js');
import confirmTemplate from './confirmModal.html';

export class BaseLegalCaseController extends BaseFormController {
    constructor($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService, IncidentService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = LegalCaseService;
        this.irfService = IrfService;
        this.session = SessionService;
        this.incidentService = IncidentService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.irfRef = null;
        this.cifRefs = [];
        this.locations = [];
        this.countrySpecific = null;
        this.formReady = false;
        this.basicCharges = ['Human Trafficking', 'Sexual Assault','Kidnapping','Fraud'];

        this.legalCaseNumber = "";
        this.tableDivSize = (window.innerWidth - 50) + 'px';
		
		this.getCountrySpecific(this.stateParams.countryId);
        this.getLegalCase(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    getRelatedFormsComplete() {
    	if (this.questions.lcNumber.response.value===null|| this.questions.lcNumber.response.value==='') {
    		let currentMax = null;
    		for (let relatedIndex in this.relatedForms.LEGAL_CASE) {
    			if (this.relatedForms.LEGAL_CASE[relatedIndex].formNumber.substring(0, this.incidentNumber.length) !== this.incidentNumber) {
    				continue;
    			}
    			if (currentMax===null || currentMax < this.relatedForms.LEGAL_CASE[relatedIndex].formNumber) {
    				currentMax = this.relatedForms.LEGAL_CASE[relatedIndex].formNumber;
    			}
    		}
    		if (currentMax===null) {
    			this.questions.lcNumber.response.value=this.incidentNumber;
    		} else {
    			if (currentMax === this.incidentNumber) {
    				this.questions.lcNumber.response.value=this.incidentNumber + 'A';
    			} else {
    				let nextChar = String.fromCharCode(currentMax.charCodeAt(currentMax.length-1)+1);
    				this.questions.lcNumber.response.value = currentMax.substring(0,currentMax.length-1)+nextChar;
    			}
    		}
    	} else {
        	this.excludeRelatedForm('LEGAL_CASE', this.questions.lcNumber.response.value);
        }
    }
    
    getLocations(stationId) {
        this.service.getLocation(stationId).then ((response) => {
            this.locations = response.data.map((x) => x.name);
            this.otherData.setRadioButton(this.locations, 'lcLocation');
        });
    }
    
    addCourtCase() {
    	let courtCases = this.getCardInstances('Court Case');
    	let card = this.createCard('Court Case');
    	this.getResponseOfQuestionByTag(card.responses,'lcCourtCaseSequence').value = courtCases.length + 1;
    	this.courtCase.push(this.initCourtCase(card));
    	courtCases.push(card);
    }
    
    initCourtCase(card) {
    	let courtCase = {};
    	let responses = card.responses;
    	courtCase.questions = _.keyBy(responses, (x) => x.question_tag);
    	courtCase.checkboxGroup = new CheckboxGroup();
    	for (let idx=0; idx <  this.basicCharges.length; idx++) {
    		courtCase.checkboxGroup.checkboxItem('lcCourtCaseCharges', this.basicCharges[idx]);
    	}
    	for (let idx=0; idx < this.countrySpecific.length; idx++) {
        	courtCase.checkboxGroup.checkboxItem('lcCourtCaseSpecific', this.countrySpecific[idx].charge);
        }
        courtCase.checkboxGroup.initOriginalValues(courtCase.questions);
        return courtCase;
    }
    
    initCheckboxGroups() {
    	if (!this.countrySpecific || !this.formReady) {
    		return;
    	}
    	
    	this.courtCase = [];
    	
    	for (let idx in this.getCardInstances('Court Case')) {
        	this.courtCase.push(this.initCourtCase(this.getCardInstances('Court Case')[idx]));
        }
    }
    
    getCountrySpecific(countryId) {
    	this.service.getCountrySpecificCharges(countryId).then ((response) => {
    		this.countrySpecific = response.data.results;
    		this.initCheckboxGroups();
    	});
    }

    getLegalCase(countryId, stationId, id) {
    	this.spinner.show("Loading Legal Case...");
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getLegalCase(countryId, stationId, id).then((response) => {
            	this.spinner.hide();
                this.errorMessages = [];
                this.warningMessages = [];
                this.processResponse(response);
                let timelineCards = this.getCardInstances('Timeline');
                timelineCards.sort(BaseLegalCaseController.compareTimelineEntries);
                if (this.stateParams.id === null) {
	                this.set_errors_and_warnings(response.data);
	                this.messagesEnabled = true;
	            }
                this.service.getIncidentDetail(this.stateParams.incidentId).then((response) => {
                	this.incidentNumber = response.data.incident_number;
                	this.sfs = response.data.sfs;
                	this.pvfs = response.data.pvfs;
                	if (this.stateParams.id === null) {
                    	this.questions.lcStatus.response.value = 'active';
                    }
            		this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
                });
                if (this.questions.lcIncident.response.value === null) {
                	this.questions.lcIncident.response.value = this.stateParams.incidentId;
                }
                
                this.station_name = this.response.station_name;
                this.getLocations(this.stateParams.stationId);
                this.formReady = true;
                this.initCheckboxGroups();
                let courtCases = this.getCardInstances('Court Case');
                if (courtCases.length < 1) {
                	this. addCourtCase();
                }
            });
        });
    }
    
    getSf(sfId) {
    	let sf = null;
    	for (let idx in this.sfs) {
    		if (this.sfs[idx].id+'' === sfId+'') {
    			sf = this.sfs[idx];
    			break;
    		}
    	}
    	return sf;
    }
    
    getPvf(pvfId) {
    	let pvf = null;
    	for (let idx in this.pvfs) {
    		if (this.pvfs[idx].id+'' === pvfId+'') {
    			pvf = this.pvfs[idx];
    			break;
    		}
    	}
    	return pvf;
    }

    confirmCharge(message, acceptLabel, declineLabel, cardIndex, charge) {
    	this.modalActions = [];
    	this.$uibModal.open({
    		bindToController: true,
    		controller: ConfirmModalController,
    		controllerAs: "$ctrl",
    		resolve: {
    			message: () => message,
    			acceptLabel: () => acceptLabel,
    			declineLabel: () => declineLabel,
    			modalActions: () => this.modalActions,
    		},
    		size: 'md',
    		templateUrl: confirmTemplate,
    	}).result.then(() => {
    		if (this.modalActions[0]) {
    			// remove charge
    			this.removeCharge(cardIndex, charge);
    		} else {
    			this.courtCase[cardIndex].checkboxGroup.questions.lcCourtCaseCharges[charge] = true;
    		}
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
                parentController: ()=> this,
                caseStatus: () => this.questions.lcStatus.response.value,
                userName: () => this.session.user.first_name + ' ' + this.session.user.last_name,
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
                    cards.sort(BaseLegalCaseController.compareTimelineEntries);
                }
            }
        });
    }
    
    getUploadFileQuestions() {
        return [1020];
    }
    
    static getTimelineResponseValue(entry, question_id) {
        for (let idx=0; idx < entry.responses.length; idx++) {
            if (entry.responses[idx].question_id === question_id) {
                return entry.responses[idx].response.value;
            }
        }
        return null;
    }
    
    static compareTimelineEntries(a,b) {
        let aValue = BaseLegalCaseController.getTimelineResponseValue(a, 1035);
        let bValue = BaseLegalCaseController.getTimelineResponseValue(b, 1035);
        if (aValue < bValue) {
            return 1;
        } else if (aValue > bValue) {
            return -1;
        } else {
            if (a.storage_id) {
                if (b.storage_id) {
                    return b.storage_id - a.storage_id;
                } else {
                    return 1;
                }
            } else {
                return -1;
            }
        }
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
        let submission_date = this.dateData.dateToString(new Date());
        let suspectCards = this.getCardInstances('Suspects');
        for (let card=0; card < suspectCards.length; card++) {
        	let cardQuestions = _.keyBy(suspectCards[card].responses, (x) => x.question_tag);
        	
        	if (cardQuestions.lcSuspectArrestDate.response.value && !cardQuestions.lcSuspectArrestSubmittedDate.response.value) {
        		cardQuestions.lcSuspectArrestSubmittedDate.response.value = submission_date;
        	}
        }
        let chargeCards = this.getCardInstances('Suspect Charge');
        for (let card=0; card < chargeCards.length; card++) {
        	let cardQuestions = _.keyBy(chargeCards[card].responses, (x) => x.question_tag);
        	
        	if (cardQuestions.lcSuspectChargeVerdictDate.response.value && !cardQuestions.lcSuspectChargeVerdictSubmittedDate.response.value) {
        		cardQuestions.lcSuspectChargeVerdictSubmittedDate.response.value = submission_date;
        	}
        }
        for (let courtCaseIdx in this.courtCase) {
        	this.courtCase[courtCaseIdx].checkboxGroup.updateResponses();
        }
        if (this.ignoreWarnings) {
            this.response.ignore_warnings = 'True';
        } else {
            this.response.ignore_warnings = 'False';
        }
        this.service.submitLegalCase(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_tag);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             this.state.go('legalCaseList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
    
    chargesChange(cardIndex, charge){
    	let charges = this.getCardInstances('Suspect Charge');
   		if (!this.courtCase[cardIndex].checkboxGroup.questions.lcCourtCaseCharges[charge]) {
   			let caseNumber = this.courtCase[cardIndex].questions.lcCourtCaseCourtCase.response.value;
   			let canRemove = true;
   			if (caseNumber === null) {
   				caseNumber = '';
   			} else {
   				for (let chargeIndex in charges) {
   					if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses, 'lcSuspectChargeSequence').value+''!==(cardIndex+1)+'') {
   						continue;
   					}
   					if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses, 'lcSuspectChargeCharge').value!==charge) {
   						continue;
   					}
   					let verdict = this.getResponseOfQuestionByTag(charges[chargeIndex].responses, 'lcSuspectChargeVerdict').value;
   					if (verdict === 'Conviction' || verdict === 'Acquittal') {
   						canRemove = false;
   					}
   				}
   			}
   			if (canRemove) {
	   			let message = 'Confirm that you want to remove the charge "' + charge + '" from court case #' + 
	   				caseNumber + '(' + (cardIndex+1) + ')' ;
	   			this.confirmCharge (message, "Remove Charge", "Keep Charge", cardIndex, charge);
	   		} else {
	   			let message = 'A verdict has been rendered on the charge "' + charge + '" so the charge may not be removed';
	   			this.confirmCharge (message, null, "Keep Charge", cardIndex, charge);
	   		}
   			return;
   		}
    	
    	// Add new charge
    	let courtCases = this.getCardInstances('Court Case');
    	let caseSequence = this.getResponseOfQuestionByTag(courtCases[cardIndex].responses,'lcCourtCaseSequence').value + '';
    	
    	// Find all SFs for suspects that are marked as being part of the case
    	let suspects = this.getCardInstances('Suspects');
    	let sfsForAdd = [];
    	for (let suspectIndex in suspects) {
    		let suspectCases = this.getResponseOfQuestionByTag(suspects[suspectIndex].responses,'lcSuspectCourtCases').value.split(';');
    		for (let caseIndex in suspectCases) {
    			if (suspectCases[caseIndex] === caseSequence) {
    				sfsForAdd.push(this.getResponseOfQuestionByTag(suspects[suspectIndex].responses,'lcSuspectSuspect').value);
    			}
    		}
    	}
    	
    	for (let sfIndex in sfsForAdd) {
    		let sf = sfsForAdd[sfIndex];
    		let found = false;
    		for (let chargeIndex in charges) {
    			if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses,'lcSuspectChargeSuspect').value !== sf) {
    				continue;
    			}
    			if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses,'lcSuspectChargeSequence').value + '' !== caseSequence) {
    				continue;
    			}
    			if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses,'lcSuspectChargeCharge').value !== charge) {
    				continue;
    			}
    			
    			// This should not occur!!!
    			found = true;
    		}
    		
    		if (found) {
    			continue;
    		}
    		
    		let newCard = this.createCard('Suspect Charge');
    		this.getResponseOfQuestionByTag(newCard.responses,'lcSuspectChargeSuspect').value = sf;
    		this.getResponseOfQuestionByTag(newCard.responses,'lcSuspectChargeSequence').value = caseSequence;
    		this.getResponseOfQuestionByTag(newCard.responses,'lcSuspectChargeCharge').value = charge;
    		this.getCardInstances('Suspect Charge').push(newCard);
    	}
    }
    
    getSuspect(sf) {
    	let suspect = null;
    	let suspects = this.getCardInstances('Suspects');
    	for (let suspectIndex in suspects) {
    		if (this.getResponseOfQuestionByTag(suspects[suspectIndex].responses,'lcSuspectSuspect').value+'' === sf+'') {
    			suspect = suspects[suspectIndex];
    			break;
    		}
    	}
    	return suspect;
    }
    
    suspectSummary(sf, caseSequence) {
    	let convictionCount = 0;
    	let acquittalCount = 0;
    	let convictionDays = 0;
    	
    	let charges = this.getCardInstances('Suspect Charge');
    	for (let chargeIndex in charges) {
    		let charge = charges[chargeIndex];
    		if (this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeSuspect').value+'' !== sf+'') {
    			continue;
    		}
    		if (caseSequence !==null &&
    				this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeSequence').value+'' !== caseSequence+'') {
    			continue;
    		}
    		if (this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeVerdict').value === 'Conviction') {
    			convictionCount += 1;
    			let totalDays = this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeImprisonmentTotal').value;
    			if (!isNaN(totalDays)) {
    				convictionDays += totalDays;
    			}
    		} else if (this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeVerdict').value === 'Acquittal') {
    			acquittalCount += 1;
    		}
    	}
    	
    	let result = '';
    	if (convictionCount) {
    		let years = Math.floor(convictionDays/365);
    		let days = convictionDays - years * 365;
    		result = 'Conviction ' + years + ' years';
    		if (days > 0) {
    			result += ' and ' + days + ' days';
    		}
    		
    	} else if (acquittalCount) {
    		result = 'Acquittal';
    	}
    	return result;
    }
    
    removeCharge(caseIndex, charge) {
    	let courtCases = this.getCardInstances('Court Case');
    	let caseSequence = this.getResponseOfQuestionByTag(courtCases[caseIndex].responses,'lcCourtCaseSequence').value + '';
    	
    	let charges = this.getCardInstances('Suspect Charge');
    	for (let chargeIndex=charges.length-1; chargeIndex>=0; chargeIndex--) {
    		if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses,'lcSuspectChargeSequence').value + '' !== caseSequence) {
    			continue;
    		}
    		if (this.getResponseOfQuestionByTag(charges[chargeIndex].responses,'lcSuspectChargeCharge').value !== charge) {
    			continue;
    		}
    		charges.splice(chargeIndex,1);
    	}
    }
    
    displayNumber(cardLabel, index) {
    	if (this.getCardInstances(cardLabel).length > 1) {
    		return '' + (index + 1);
    	} else {
    		return ' ';
    	}
    }
    
    displayCaseNumbers(cases) {
    	if (this.getCardInstances('Court Case').length > 1) {
    		return '(' + cases + ')';
    	} else {
    		return '';
    	}
    }
}

export default {
    BaseLegalCaseController
};
