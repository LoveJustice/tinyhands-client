import {BaseModalController} from '../baseModalController.js';
import './common/common.less';

// Only addition is to get the case status from the legal case into the suspect modal
class LegalCaseVerificationModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, parentController, caseStatus, userName) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, parentController);
        this.caseStatus = caseStatus;
        this.userName = userName;
        this.parentController = parentController;
        this.suspect = null;
        this.filteredSfs = [];
        this.filteredSfCases = {};
    }
    
    delayedQuestionData() {
    	if (this.isAdd) {
	    	let charges = this.getCardInstances('Suspect Charge');
	    	let verifications = this.getCardInstances('Verification');
	    	for (let chargeIndex in charges) {
	    		let verdict = this.getResponseOfQuestionByTag(charges[chargeIndex].responses, 'lcSuspectChargeVerdict').value;
	    		if (verdict !== 'Conviction' && verdict !== 'Acquittal') {
	    			continue;
	    		}
	    		let sfId = this.getResponseOfQuestionByTag(charges[chargeIndex].responses, 'lcSuspectChargeSuspect').value + '';
	    		let theCase = this.getResponseOfQuestionByTag(charges[chargeIndex].responses, 'lcSuspectChargeSequence').value + '';
	    		let verificationFound = false;
	    		for (let verificationIndex in verifications) {
	    			if (this.getResponseOfQuestionByTag(verifications[verificationIndex].responses, 'lcVerificationSf').value + '' === sfId &&
	    					this.getResponseOfQuestionByTag(verifications[verificationIndex].responses, 'lcVerificationSequence').value + '' === theCase) {
	    				verificationFound = true;
	    			}
	    		}
	    		if (!verificationFound) {
	    			if (!this.filteredSfCases.hasOwnProperty(sfId)) {
	    				this.filteredSfs.push(this.getSf(sfId));
	    				this.filteredSfCases[sfId] = [];
	    			}
	    			this.filteredSfCases[sfId].push(theCase);
	    		}
	    	}
    	} else {
    		this.setSuspect();
    	}
    }
    
    setSuspect() {
    	let sfId = this.questions.lcVerificationSf.response.value + '';
    	if (this.isAdd && this.filteredSfCases[sfId].length===1) {
    		this.questions.lcVerificationSequence.response.value = this.filteredSfCases[sfId][0];
    	}
    	
    	let suspects = this.getCardInstances('Suspects');
    	for (let suspectIndex in suspects) {
    		if (this.getResponseOfQuestionByTag(suspects[suspectIndex].responses, 'lcSuspectSuspect').value+''===sfId) {
    			this.suspect = suspects[suspectIndex];
    		}
    	}
    }
    
    getResponseOfQuestionByTag(responses, tag) {
    	return this.parentController.getResponseOfQuestionByTag(responses, tag);
    }
    
    getCardInstances(tag) {
    	return this.parentController.getCardInstances(tag);
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
    
    canSave() {
    	return (this.questions.lcVerificationSf.response.value!==null &&
    		(this.questions.lcVerificationVerifiedAttachment.response.value==='Yes' ||
    			this.questions.lcVerificationVerifiedAttachment.response.value==='No' && 
    			this.questions.lcVerificationTakenIntoCustody.response.value!==null &&
    			this.questions.lcVerificationChargedWithCrime.response.value!==null &&
    			this.questions.lcVerificationPoliceOrCourtCase.response.value!==null));
    }
}

export {LegalCaseVerificationModalController};