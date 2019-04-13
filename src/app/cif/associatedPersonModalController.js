import {CifModalController} from './cifModalController.js';

class AssociatedPersonModalController extends CifModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config, identificationTypes, associatedPersons) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, identificationTypes);
        
        this.constants = constants; 
        this.associatedPersons = associatedPersons;
    }
}

export {AssociatedPersonModalController};