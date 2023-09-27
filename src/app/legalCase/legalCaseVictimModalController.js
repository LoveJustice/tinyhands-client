import {BaseModalController} from '../baseModalController.js';
const CheckboxGroup = require('../checkboxGroup.js');
import './common/common.less';

// Only addition is to get the case status from the legal case into the suspect modal
class LegalCaseVictimModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, parentController, caseStatus, userName) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, parentController);
        this.caseStatus = caseStatus;
        this.userName = userName;
        this.courtCaseCount = parentController.getCardInstances('Court Case').length;
        this.parentController = parentController;
        this.filteredPvfs = [];
    }
    
    delayedQuestionData() {
        this.checkboxGroup = new CheckboxGroup();
        for (let idx=0; idx < this.courtCaseCount; idx++) {
        	this.checkboxGroup.checkboxItem('lcVictimCourtCases', (idx+1));
        }
        this.checkboxGroup.initOriginalValues(this.originalQuestions);
        
        if (this.questions.lcVictimPvf.response.value) {
        	this.questions.lcVictimPvf.response.value = this.questions.lcVictimPvf.response.value + '';
        }
        let pvfs = this.parentController.pvfs;
        for (let idx in pvfs) {
        	if (this.questions.lcVictimPvf.response.value + '' === pvfs[idx].id + '') {
        		this.filteredPvfs.push(pvfs[idx]);
        	} else {
        		let cards = this.parentController.getCardInstances('Victims');
        		let found = false;
        		for (let cardIdx in cards) {
        			let card = cards[cardIdx];
        			let myPvf = this.parentController.getResponseOfQuestionByTag(card.responses, 'lcVictimPvf').value + '';
        			if (myPvf === pvfs[idx].id + '') {
        				found = true;
        				break;
        			}
        		}
        		if (!found) {
        			this.filteredPvfs.push(pvfs[idx]);
        		}
        	}
        }
    }
    
    getPvf(pvfId) {
    	return this.parentController.getPvf(pvfId);
    }
    
    pvfUrl() {
    	let pvfId = this.questions.lcVictimPvf.response.value;
    	let url = null;
    	if (pvfId !== null && pvfId !== undefined) {
	    	for (let pvfIndex in this.parentController.relatedForms.PVF) {
	    		if (this.parentController.relatedForms.PVF[pvfIndex].id+''===pvfId+'') {
	    			url = this.parentController.relatedForms.PVF[pvfIndex].url;
	    			break;
	    		}
	    	}
	    	
    	}
    	return url;
    }
    
    subclassSave() {
    	if (this.isAdd && this.courtCaseCount === 1) {
    		this.questions.lcVictimCourtCases.response.value = '1';
    	}
    	this.checkboxGroup.updateResponses();
    }
    
    markAsDeleted() {
        this.dateData.questions[1039].value = new Date();
        this.save();
    }
}

export {LegalCaseVictimModalController};