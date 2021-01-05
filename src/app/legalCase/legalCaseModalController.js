import {BaseModalController} from '../baseModalController.js';

// Only addition is to get the case status from the legal case into the suspect modal
class LegalCaseModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, caseStatus, userName) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        this.caseStatus = caseStatus;
        this.userName = userName;
    }
    
    delayedQuestionData() {
        if (this.isAdd) {
            if (this.questions[1037].response) {
                this.questions[1037].response.value = this.userName;
            }
            if (this.questions[1038].response) {
                this.dateData.questions[1038].value = new Date();
            }
            if (this.questions[1035].response) {
                this.dateData.questions[1035].value = new Date();
            }
        }
    }
    
    subclassSave() {
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
    }
    
    markAsDeleted() {
        this.dateData.questions[1039].value = new Date();
        this.save();
    }
}

export {LegalCaseModalController};