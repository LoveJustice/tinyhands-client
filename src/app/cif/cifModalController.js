import {BaseModalController} from '../baseModalController.js';
const PersonIdentifierChoice = require('../personIdentifierChoice.js');

class CifModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, identificationTypes) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        
        this.identificationTypes = identificationTypes;
    }
    
    subclassDelayedQuestionData() {
    }
    
    delayedQuestionData() {
        this.personIdentifierChoice = new PersonIdentifierChoice(this.questions, this.identificationTypes);
        if (this.identificationTypes.length > 0 && this.config.hasOwnProperty('Person')) {
            this.processPersonResponses(this.questions, this.config.Person);
        }
        
        this.subclassDelayedQuestionData();
    }
    
    processPersonResponses(questions, personConfigList) {
        for (let question_id in questions) {
            if (personConfigList.indexOf(parseInt(question_id)) > -1) {
                if (this.personIdentifierChoice) {
                    this.personIdentifierChoice.manage(parseInt(question_id));
                }
            }
        }
    }
    
    // Override in subclass to select a default identification types
    getDefaultIdentificationTypes() {
        return [];
    }
}

export {CifModalController};