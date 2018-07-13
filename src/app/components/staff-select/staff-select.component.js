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
        this.selectedStaffList = this.selectedStaff.split(';').filter(x => x.length > 0).map(x => x.trim());
    }


    filterStaffByFirstAndLastName(staff, value) {
        if (staff && value) {
            let searchValue = value.toLowerCase();
            let matchFirstAndLastName = _.includes(staff.toLowerCase(), searchValue);
            return matchFirstAndLastName;
        }
        return false;
    }

    getStaff() {
        this.StaffService.getStaff().then(response => {
            this.staff = response.data.results.map(x => `${x.first_name} ${x.last_name}`);
        });
    }
}

export default {
    bindings: {
        selectedStaff: '='
    },
    controller: StaffSelectController,
    templateUrl: StaffSelectTemplateUrl,
    transclude: true
};