export default class NameCheckboxSelectionController {
    constructor($uibModalInstance, $scope, nameChoices, selectedNames, selectionList, optionList, valueType, viewOnly) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        this.nameChoices = nameChoices;
        this.selectionList = selectionList;
        this.selected = {};
        this.valueType = valueType;
        this.viewOnly = viewOnly;
        this.optionList = optionList;
        this.addedLocal = "";
        this.errorMessage = ' ';
        this.title = '';
        this.legendText = '';
        
        switch(this.valueType) {
        case 'address':
            this.title = 'Select Location Addresses';
            this.legendText = 'Location Form';
            this.formType = 'LF'
            break;
        case 'pv':
            this.title = 'Select Potential Victim Names';
            this.legendText = 'Potential Victim Form';
            this.formType = 'PVF'
            break;
        case 'suspect':
            this.title = 'Select Suspect Names';
            this.legendText = 'Suspect Form';
            this.formType = 'SF'
            break;
        }
        
        let currentSelected = [];
        if (selectedNames) {
            currentSelected = selectedNames.split(';'); 
        }
        for (let selectedIdx in currentSelected) {
            this.selected[currentSelected[selectedIdx]] = true;
        }
    }
    
    addLocal() {
        this.errorMessage = ' ';
        if (this.addedLocal === '') {
            return;
        }
        if (this.selectionList.hasOwnProperty(this.addedLocal)) {
            this.errorMessage ='"' + this.addedLocal + '" is already present';
            return;
        }
        this.nameChoices.locals.push({text:this.addedLocal});
        this.selectionList[this.addedLocal] = {text:this.addedLocal, nameType: 'locals'};
        this.selected[this.addedLocal] = true;
        this.optionList.push(this.addedLocal);
        this.addedLocal = '';
    }
    
    getClass(nameType, baseClass) {
        let theClass = baseClass + ' ' + nameType + 'Coloring';
        return theClass;
    }
    
    select() {
        let newSelected = '';
        let sep = '';
        for (let idx in this.optionList) {
            let key = this.optionList[idx];
            if (this.selected[key]) {
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
