import {CifModalController} from './cifModalController.js';

const CheckboxGroup = require('../checkboxGroup.js');

class AssociatedPersonModalController extends CifModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config, identificationTypes, associatedPersons, checkboxGroupItems) {
        'ngInject';
        super($uibModalInstance, $scope, constants, isAdd, card, isViewing, modalActions, config, identificationTypes);
        
        this.constants = constants; 
        this.associatedPersons = associatedPersons;
        this.checkboxGroup = new CheckboxGroup();
        
        for (let idx=0; idx < checkboxGroupItems.length; idx++) {
            this.checkboxGroup.checkboxItem(checkboxGroupItems[idx].group, checkboxGroupItems[idx].option);
        }
        
        this.checkboxGroup.initOriginalValues(this.questions);
    }
    
    subclassSave() { 
        this.checkboxGroup.updateResponses();
    }
}

export {AssociatedPersonModalController};