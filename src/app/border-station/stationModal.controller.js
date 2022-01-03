import {BaseModalController} from '../baseModalController.js';

export default class StationModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, restrictNameList) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        this.isRemove = false;
        this.restrictNameList = restrictNameList;
        this.isDuplicate = false;
    }
    
    checkLocationName() {
        this.isDuplicate = false;
        for (let nameIdx in this.restrictNameList) {
            if (this.restrictNameList[nameIdx] === this.questions[963].response.value) {
                this.isDuplicate = true;
            }
        }
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