import {BaseModalController} from '../baseModalController.js';

class AssociatedPersonModalController extends BaseModalController {
    constructor($uibModalInstance, constants, $scope, isAdd, card, isViewing, modalActions, config, associatedPersons) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config);
        
        this.constants = constants; 
        this.associatedPersons = associatedPersons;
    }
}

export {AssociatedPersonModalController};