import {BaseModalController} from '../baseModalController.js';

export default class StationModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        this.isRemove = false;
    }
    
    delayedQuestionData() {
        if (this.isAdd) {
            this.questions[973].response.value = true;
        }
    }
    
    remove() {
        this.isRemove = true;
    }
}