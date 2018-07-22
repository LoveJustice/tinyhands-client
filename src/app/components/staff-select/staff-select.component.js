import StaffSelectTemplateUrl from './staff-select.html';

export class StaffSelectController {
    constructor(StaffService) {
        'ngInject';
        this.StaffService = StaffService;
        this.getStaff();
        this.searchStaff = '';
        this._selectedStaffList = [];
    }

    get selectedStaffList() {
        return this._selectedStaffList;
    }

    set selectedStaffList(value) {
        this._selectedStaffList = value;
        this.selectedStaff = this._selectedStaffList.join(';');
    }

    $onInit() {
    	this.priorSelectedStaff = this.selectedStaff;
        this.selectedStaffList = this.selectedStaff.split(';').filter(x => x.length > 0).map(x => x.trim());
        this.priorStationId = '';
    }
    
    $doCheck() {
    	if (this.selectedStaff !== this.priorSelectedStaff) {
    		this.priorSelectedStaff = this.selectedStaff;
    		this.selectedStaffList = this.selectedStaff.split(';').filter(x => x.length > 0).map(x => x.trim());
    	}
    	if (this.priorStationId !== this.stationId) {
    		this.priorStationId = this.stationId;
    		this.getStaff();
    	}
    }

    filterStaffByName(staffName, value) {
        if (staffName && value) {
            let searchValue = value.toLowerCase();
            return _.includes(staffName.toLowerCase(), searchValue);
        }
        return false;
    }

    getStaff() {
    	if (typeof this.stationId !== 'undefined') {
	        this.StaffService.getStaff(this.stationId).then(response => {
	            this.staff = response.data.results.map(x => `${x.first_name} ${x.last_name}`);
	        });
    	}
    }
}

export default {
    bindings: {
        selectedStaff: '=',
        stationId: '='
    },
    controller: StaffSelectController,
    templateUrl: StaffSelectTemplateUrl,
    transclude: true
};