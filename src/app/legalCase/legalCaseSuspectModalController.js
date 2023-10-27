import {BaseModalController} from '../baseModalController.js';
const CheckboxGroup = require('../checkboxGroup.js');
const DateData = require('../dateData.js');
const ConfirmModalController = require('./confirmModalController.js');
import confirmTemplate from './confirmModal.html';
import './common/common.less';

// Only addition is to get the case status from the legal case into the suspect modal
class LegalCaseSuspectModalController extends BaseModalController {
    constructor($uibModalInstance, $uibModal, $scope, constants, isAdd, card, isViewing, modalActions, config, parentController, caseStatus, userName) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, parentController);
        this.$uibModal = $uibModal;
        this.caseStatus = caseStatus;
        this.userName = userName;
        this.parentController = parentController;
        this.courtCaseCount = this.getCardInstances('Court Case').length;
        this.filteredSfs = [];
    }
    
    delayedQuestionData() {
        this.checkboxGroup = new CheckboxGroup();
        for (let idx=0; idx < this.courtCaseCount; idx++) {
        	this.checkboxGroup.checkboxItem('lcSuspectCourtCases', (idx+1));
        }
        this.checkboxGroup.initOriginalValues(this.originalQuestions);
        
        if (this.questions.lcSuspectSuspect.response.value) {
        	this.questions.lcSuspectSuspect.response.value = this.questions.lcSuspectSuspect.response.value + '';
        }
        let sfs = this.parentController.sfs;
        for (let idx in sfs) {
        	if (this.questions.lcSuspectSuspect.response.value + '' === sfs[idx].id + '') {
        		this.filteredSfs.push(sfs[idx]);
        	} else {
        		let cards = this.parentController.getCardInstances('Suspects');
        		let found = false;
        		for (let cardIdx in cards) {
        			let card = cards[cardIdx];
        			let mySf = this.getResponseOfQuestionByTag(card.responses, 'lcSuspectSuspect').value + '';
        			if (mySf === sfs[idx].id + '') {
        				found = true;
        				break;
        			}
        		}
        		if (!found) {
        			this.filteredSfs.push(sfs[idx]);
        		}
        	}
        }
        
        this.initCourtCases();
    }
    
    initCourtCases() {
    	this.courtCases = [];
    	let cases = this.parentController.getCardInstances('Court Case');
    	let charges = this.parentController.getCardInstances('Suspect Charge');
    	let sf = this.questions.lcSuspectSuspect.response.value + '';
    	for (let idx in cases) {
    		let card = cases[idx];
        	
        	let theCase = {
        		questions: [],
        		charges: [],
        	};
        	for (let questionIndex in card.responses) {
        		theCase.questions[card.responses[questionIndex].question_tag] = {
        			question_id: card.responses[questionIndex].question_id,
        			question_tag: card.responses[questionIndex].question_tag,
        			storage_id: card.responses[questionIndex].storage_id,
        			type: card.responses[questionIndex].type,
        			response: {value: card.responses[questionIndex].response.value},
        		};
        	}
        	for (let chargeIdx in charges) {
        		let charge = charges[chargeIdx];
        		if (this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeSequence').value + '' !== theCase.questions.lcCourtCaseSequence.response.value + '' ||
        				this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeSuspect').value + '' !== sf) {
        			continue;
        		}
        		
        		let theCharge = {
        			saved: false,
        			questions:[],
        		};
        		for (let questionIndex in charge.responses) {
        			theCharge.questions[charge.responses[questionIndex].question_tag] = {
	        			question_id: charge.responses[questionIndex].question_id,
	        			question_tag: charge.responses[questionIndex].question_tag,
	        			storage_id: charge.responses[questionIndex].storage_id,
	        			type: charge.responses[questionIndex].type,
	        			response: {value: charge.responses[questionIndex].response.value},
        			};
        		}
        		
        		theCharge.dateData = new DateData(theCharge.questions);
        		theCharge.dateData.setDate('lcSuspectChargeVerdictDate','basic');
        		theCharge.dateData.setDate('lcSuspectChargeVerdictSubmittedDate','basic');
        		theCase.charges.push(theCharge);
        	}
        	
        	this.courtCases.push(theCase);
        }
    }
    
    caseChange(caseIndex) {
    	if (!this.checkboxGroup.questions.lcSuspectCourtCases[(caseIndex + 1)]) {
    		for (let chargeIndex in this.courtCases[caseIndex].charges) {
    			if (this.courtCases[caseIndex].charges[chargeIndex].dateData.questions.lcSuspectChargeVerdictSubmittedDate.value) {
    				this.confirmCase("You cannot remove case (" + (caseIndex + 1) + ") from the suspect because a verdict has been submitted for the case.", null, "Keep Case", caseIndex, '');
    				return;
    			}
    		}
    		this.confirmCase("Confirm that you want to remove case (" + (caseIndex + 1) + ") from the suspect", "Remove Case", "Keep Case", caseIndex, '');
    	} else {
    		// Add case
    		let caseCharges = this.parentController.courtCase[caseIndex].checkboxGroup.getValue('lcCourtCaseCharges').split(';');
    		for (let chargeIndex in caseCharges) {
    			if (caseCharges[chargeIndex] !== '') {
	    			let newCard = this.parentController.createCard('Suspect Charge');
	    			let theCharge = {
	    				saved: false,
	    				questions:_.keyBy(newCard.responses, (x) => x.question_tag),
	    			};
	    			theCharge.questions.lcSuspectChargeSuspect.response.value = this.questions.lcSuspectSuspect.response.value;
	    			theCharge.questions.lcSuspectChargeSequence.response.value = caseIndex+1;
	    			theCharge.questions.lcSuspectChargeCharge.response.value = caseCharges[chargeIndex];
	    			theCharge.dateData = new DateData(theCharge.questions);
	        		theCharge.dateData.setDate('lcSuspectChargeVerdictDate','basic');
	        		theCharge.dateData.setDate('lcSuspectChargeVerdictSubmittedDate','basic');
	    			this.courtCases[caseIndex].charges.push(theCharge);
    			}
    		}
    	}
    }
    
    caseChargeChange(suspectCharge) {
    	if (!suspectCharge.questions.lcSuspectChargeWasCharged.response.value &&
    			suspectCharge.dateData.questions.lcSuspectChargeVerdictSubmittedDate.value) {
    		suspectCharge.questions.lcSuspectChargeWasCharged.response.value = true;
    		this.confirmCaseCharge("You cannot remove charge (" + suspectCharge.questions.lcSuspectChargeCharge.response.value +
    				 ") from the case because a verdict has been submitted for the case.", "Keep Charge");
    		return;
    	}
    	return;
    }
    
    removeCase(caseIndex) {
    	this.courtCases[caseIndex].charges = [];
    }
    
    confirmCase(message, acceptLabel, declineLabel, caseIndex) {
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
    			this.removeCase(caseIndex);
    		} else {
    			this.checkboxGroup.questions.lcSuspectCourtCases[caseIndex+1] = true;
    		}
    	});
    }
    
    confirmCaseCharge(message, declineLabel) {
    this.modalActions = [];
    	this.$uibModal.open({
    		bindToController: true,
    		controller: ConfirmModalController,
    		controllerAs: "$ctrl",
    		resolve: {
    			message: () => message,
    			acceptLabel: () => null,
    			declineLabel: () => declineLabel,
    			modalActions: () => this.modalActions,
    		},
    		size: 'md',
    		templateUrl: confirmTemplate,
    	}).result.then(() => {
    	});
    }
    
    setSuspect() {
    	if (this.isAdd && this.questions.lcSuspectSuspect.response.value !== null &&
    			this.parentController.getCardInstances('Court Case').length === 1) {
    		this.checkboxGroup.questions.lcSuspectCourtCases[1] = true;
    		this.caseChange(0);
    	}
    }
    
    displayNumber(theCase) {
    	if (this.getCardInstances('Court Case').length > 1) {
    		return '' + theCase.questions.lcCourtCaseSequence.response.value;
    	} else {
    		return ' ';
    	}
    }
    
    getSf(sfId) {
    	if (sfId !== undefined) {
    		return this.parentController.getSf(sfId);
    	}
    }
    
    sfUrl() {
    	let sfId = this.questions.lcSuspectSuspect.response.value;
    	let url = null;
    	if (sfId !== null && sfId !== undefined) {
	    	for (let sfIndex in this.parentController.relatedForms.SF) {
	    		if (this.parentController.relatedForms.SF[sfIndex].id+''===sfId+'') {
	    			url = this.parentController.relatedForms.SF[sfIndex].url;
	    			break;
	    		}
	    	}
	    	
    	}
    	return url;
    }
    
    getCardInstances(tag) {
    	return this.parentController.getCardInstances(tag);
    }
    
    getResponseOfQuestionByTag(responses, tag) {
    	return this.parentController.getResponseOfQuestionByTag(responses, tag);
    }
    
    buildResponses(questions) {
    	let total = 0;
    	let years = questions.lcSuspectChargeImprisonmentYears.response.value;
    	let days = questions.lcSuspectChargeImprisonmentDays.response.value;
    	if (!isNaN(years)) {
    		total += years * 365;
    	}
    	if (!isNaN(days)) {
    		total += days;
    	}
    	questions.lcSuspectChargeImprisonmentTotal.response.value = total;
    	let responses = [];
		for (let questionIndex in questions) {
			responses.push(questions[questionIndex]);
		}
		return responses;
    }
    
    subclassSave() {
    	this.checkboxGroup.updateResponses();
    	
    	// Update existing and remove deleted charges
    	let sf = this.questions.lcSuspectSuspect.response.value + '';
    	let charges = this.parentController.getCardInstances('Suspect Charge');
    	for (let chargeIndex=charges.length-1; chargeIndex>=0; chargeIndex--) {
    		let charge = charges[chargeIndex];
    		if (this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeSuspect').value + '' !== sf) {
    			continue;
    		}
    		
    		let found = false;
    		let caseSequence = this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeSequence').value;
    		for (let caseChargeIndex in this.courtCases[caseSequence-1].charges) {
    			if (this.getResponseOfQuestionByTag(charge.responses, 'lcSuspectChargeCharge').value === 
    					this.courtCases[caseSequence-1].charges[caseChargeIndex].questions.lcSuspectChargeCharge.response.value) {
    				found = true;
    				this.courtCases[caseSequence-1].charges[caseChargeIndex].dateData.updateResponses();
    				charge.responses = this.buildResponses(this.courtCases[caseSequence-1].charges[caseChargeIndex].questions);
    				this.courtCases[caseSequence-1].charges[caseChargeIndex].saved = true;
    			}
    		}
    		if (!found) {
    			charges.splice(chargeIndex,1);
    		}
    	}
    	
    	// Save new charges
    	for (let caseIndex in this.courtCases) {
    		for (let chargeIndex in this.courtCases[caseIndex].charges) {
    			if (!this.courtCases[caseIndex].charges[chargeIndex].saved) {
    				let newCard = this.parentController.createCard('Suspect Charge');
    				newCard.responses = this.buildResponses(this.courtCases[caseIndex].charges[chargeIndex].questions);
    				charges.push(newCard);
    				this.courtCases[caseIndex].charges[chargeIndex].saved = true;
    			}
    		}
    	}
    	this.parentController.setCaseStatus();
    }
}

export {LegalCaseSuspectModalController};