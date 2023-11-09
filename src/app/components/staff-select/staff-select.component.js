import StaffSelectTemplateUrl from './staff-select.html?url';
import checkboxSelectionTemplate from './checkboxSelection.html?url';
import CheckboxSelectionController from './checkboxSelectionController.js';
/* global _ */

export class StaffSelectController {
    constructor($scope, $uibModal, StaffSelectService) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.StaffSelectService = StaffSelectService;
        this.getStaff();
    }
    
    $doCheck() {
        if (this.selectedStaff !== this.priorSelectedStaff) {
            this.priorSelectedStaff = this.selectedStaff; 
        }
        if (this.priorStationId !== this.stationId) {
            this.priorStationId = this.stationId;
            this.getStaff();
        }
        this.setDisplay()
    }

    setDisplay() {
        this.display = '';
        if (this.selectedStaff !== undefined && this.selectedStaff !== null) {
            let selectedOptions = this.selectedStaff.split(';');
            this.display = selectedOptions.join(', ');
        } 
    }

    selectOptions() {
        this.$uibModal.open({
            bindToController: true,
            controller: CheckboxSelectionController,
            controllerAs: 'vm',
            resolve: {
                optionList: () => this.staff,
                currentValue: () => this.selectedStaff,
            },
            size: 'md',
            templateUrl: checkboxSelectionTemplate,
        }).result.then((newSelected) => {
            this.selectedStaff = _.cloneDeep(newSelected);
            this.setDisplay();
        });
    }

    getStaff() {
    	if (typeof this.stationId !== 'undefined') {
	        this.StaffSelectService.getStaff(this.stationId).then((response) => {
	            this.staff = response.data.map((x) => `${x.first_name} ${x.last_name}`);
	            this.staff.sort();
	        });
    	}
    }
}

export default {
    bindings: {
        selectedStaff: '=',
        stationId: '='
    },
    controllerAs: 'ctrl',
    controller: StaffSelectController,
    templateUrl: StaffSelectTemplateUrl,
    transclude: true
};