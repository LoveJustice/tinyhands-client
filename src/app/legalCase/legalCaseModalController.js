import {BaseModalController} from '../baseModalController.js';

// Only addition is to get the case status from the legal case into the suspect modal
class LegalCaseModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, caseStatus) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        this.caseStatus = caseStatus;
    }
    
    subclassSave() {
        let totalDays = 0;
        let haveValue = false;
        if (Number.isInteger(this.originalQuestions[1021].response.value)) {
            totalDays += this.originalQuestions[1021].response.value * 365;
            haveValue = true;
        }
        if (Number.isInteger(this.originalQuestions[1022].response.value)) {
            totalDays += this.originalQuestions[1022].response.value * 30;
            haveValue = true;
        }
        if (Number.isInteger(this.originalQuestions[1023].response.value)) {
            totalDays += this.originalQuestions[1023].response.value;
            haveValue = true;
        }
        
        if (haveValue) {
            this.originalQuestions[1014].response.value = totalDays;
        } else {
            this.originalQuestions[1014].response.value = null;
        }
    }
}

export {LegalCaseModalController};