import {BaseModalController} from '../baseModalController.js';

// Only addition is to get the case status from the legal case into the suspect modal
class LegalCaseTimelineModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, parentController, caseStatus, userName) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, parentController);
        this.caseStatus = caseStatus;
        this.userName = userName;
        this.parentController = parentController;
    }
    
    delayedQuestionData() {
        if (this.isAdd) {
            if (this.questions.lcTimelineAddedBy.response) {
                this.questions.lcTimelineAddedBy.response.value = this.userName;
            }
            if (this.questions.lcTimelineDateAdded.response) {
                this.dateData.questions.lcTimelineDateAdded.value = new Date();
            }
            if (this.questions.lcTimelineCommentDate.response) {
                this.dateData.questions.lcTimelineCommentDate.value = new Date();
            }
            if (this.parentController.courtCase.length < 2) {
            	this.questions.lcTimelineCourtCaseSequence.response.value = '1';
            }
            this.comment = '';
        } else {
        	this.questions.lcTimelineCourtCaseSequence.response.value += '';
        	this.comment = this.questions.lcTimelineComment.response.value;
        }
    }
    
    subclassSave() {
    	/*
        let totalDays = 0;
        let haveValue = false;
        if (this.originalQuestions[1021] && Number.isInteger(this.originalQuestions[1021].response.value)) {
            totalDays += this.originalQuestions[1021].response.value * 365;
            haveValue = true;
        }
        if (this.originalQuestions[1022] && Number.isInteger(this.originalQuestions[1022].response.value)) {
            totalDays += this.originalQuestions[1022].response.value * 30;
            haveValue = true;
        }
        if (this.originalQuestions[1023] && Number.isInteger(this.originalQuestions[1023].response.value)) {
            totalDays += this.originalQuestions[1023].response.value;
            haveValue = true;
        }
        
        if (this.originalQuestions[1014]) {
            if (haveValue) {
                this.originalQuestions[1014].response.value = totalDays;
            } else {
                this.originalQuestions[1014].response.value = null;
            }
        }
        */
    }
    
    markAsDeleted() {
        this.dateData.questions.lcTimelineDateRemoved.value = new Date();
        this.save();
    }
}

export {LegalCaseTimelineModalController};