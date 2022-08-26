import NameSelectTemplateUrl from './name-select.html';
import nameCheckboxSelectTemplate from './nameCheckboxSelect.html';
import NameCheckboxSelectController from './nameCheckboxSelectController.js';
/* global _ */

export class NameSelectController {
    constructor($scope, $uibModal) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.selectionList = {};
        this.selected = {};
        this.optionList = [];
        this.priorLocalsLength = -1;
        this.priorIrfsLength = -1;
        this.nameChoices = null;
    }
    
    $doCheck() {
        if (!this.nameStructure || !this.valueType) {
            return;
        }
        this.nameChoices = this.nameStructure[this.valueType];
        if (this.nameChoices && (this.selectedNames !== this.priorSelectedNames ||
        		this.nameChoices['irfs'].length !== this.priorIrfsLength ||
        		this.nameChoices['locals'].length !== this.priorLocalsLength)) {
            this.priorSelectedNames = this.selectedNames;
            this.priorLocalsLength = this.nameChoices['locals'].length;
            this.priorIrfsLength = this.nameChoices['irfs'].length;
            this.processNames();
        }
        this.setDisplay();
    }
    
    processNames() {
        let nameTypes = ['forms', 'irfs', 'locals'];
        
        for (let nameIdx in nameTypes) {
            let nameType = nameTypes[nameIdx];
            for (let idx in this.nameChoices[nameType]) {
                let nameText = this.nameChoices[nameType][idx].text;
                if (this.excludeName && this.excludeName === nameText) {
                    continue;
                }
                if (!this.selectionList.hasOwnProperty(nameText)) {
                    this.selectionList[nameText] = this.nameChoices[nameType][idx];
                    this.selectionList[nameText].nameType = nameType;
                    this.optionList.push(nameText);
                }
            }
        }
        
        let currentSelected = [];
        if (this.selectedNames) {
            currentSelected = this.selectedNames.split(';'); 
        }
        for (let idx in currentSelected) {
            if (!this.selectionList.hasOwnProperty(currentSelected[idx])) {
                this.selectionList[currentSelected[idx]] = {text:currentSelected[idx], nameType:'locals'};
                this.selected[currentSelected[idx]]= true;
                this.nameChoices.locals.push({text:currentSelected[idx]});
                this.optionList.push(currentSelected[idx]);
            }
        }
        this.optionList.sort();
    }
    
    setDisplay() {
        this.display = '';
        if (this.selectedNames !== undefined && this.selectedNames !== null) {
            let selectedOptions = this.selectedNames.split(';');
            this.display = selectedOptions.join(', ');
        } 
    }

    selectOptions() {
        this.$uibModal.open({
            bindToController: true,
            controller: NameCheckboxSelectController,
            controllerAs: 'vm',
            resolve: {
                nameChoices: () => this.nameChoices,
                selectedNames: () => this.selectedNames,
                selectionList: () => this.selectionList,
                optionList: () => this.optionList,
                valueType: () => this.valueType,
            },
            size: 'lg',
            templateUrl: nameCheckboxSelectTemplate,
        }).result.then((newSelected) => {
            this.selectedNames = _.cloneDeep(newSelected);
            this.setDisplay();
        });
    }
}

export default {
    bindings: {
        selectedNames: '=',
        nameStructure: '=',
        excludeName: '@',
        valueType: '@',
    },
    controllerAs: 'ctrl',
    controller: NameSelectController,
    templateUrl: NameSelectTemplateUrl,
    transclude: true
};