import {BaseModalController} from '../baseModalController.js';

export default class StationModalController extends BaseModalController {
    constructor($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, restrictNameList, params) {
        'ngInject';
        super($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants);
        this.isRemove = false;
        this.restrictNameList = restrictNameList;
        this.isDuplicate = false;
        this.params = params;
        this.foundStaffIndex = null;
        this.projectCount = 1;
        if (this.card.storage_id) {
            for (let staffIdx in this.params.staffList) {
                if (this.params.staffList[staffIdx].id === card.storage_id) {
                    this.projectCount = this.params.staffList[staffIdx].works_on.length;
                    this.foundStaffIndex = staffIdx;
                    if (this.projectCount === 1) {
                        this.worksOn = this.params.staffList[staffIdx].works_on[0].works_on.project_id + '';
                    } else {
                        this.worksOn = this.params.staffList[staffIdx].works_on;
                    }
                    break;
                }
            }
        } else {
            this.worksOn = this.params.projectId + '';
        }
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
    
    subclassSave() {
        let tmp = -1;
        if (this.foundStaffIndex) {
            tmp = this.params.staffList[this.foundStaffIndex].works_on.length;
        }
        if (tmp === 1) {
            let entry = this.params.staffList[this.foundStaffIndex].works_on[0].works_on;
            entry.project_id = this.worksOn;
        } else if (this.isAdd) {
            this.params.staffList.push({
                // staff does not have id yet, so we need to match on name
                id: null,
                first_name: this.questions[957].response.value,
                last_name: this.questions[958].response.value,
                works_on: [
                    {
                        id: null,
                        percent: 100,
                        financial: {project_id: this.params.projectId},
                        works_on: {project_id: this.worksOn}
                    }
                ]
            });
        }
    }
    
    remove() {
        this.isRemove = true;
    }
}