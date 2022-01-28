export default class CheckboxSelectionController {
    constructor($uibModalInstance, $scope, optionList, currentValue) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        this.selectionList = {};
        
        for (let idx in optionList) {
            this.selectionList[optionList[idx]] = false;
        }
        
        let currentSelected = [];
        if (currentValue) {
            currentSelected = currentValue.split(';'); 
        }
        for (let idx in currentSelected) {
            this.selectionList[currentSelected[idx]] = true;
        }
    }
    
    select() {
        let newSelected = '';
        let sep = '';
        for (let key in this.selectionList) {
            if (this.selectionList[key]) {
                newSelected += sep + key;
                sep=";";
            }
        }
        this.$uibModalInstance.close(newSelected);
    }
    
    cancel() {
        this.$uibModalInstance.dismiss();
    }
}
