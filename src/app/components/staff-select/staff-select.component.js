import StaffSelectTemplateUrl from './staff-select.html';
import './staff-select.less';

export class StaffSelectController {
    constructor(StaffService) {
        'ngInject';
        this.StaffService = StaffService;

        this.getStaff();
    }

    filterStaff(staff, value) {
        if (staff) {
            const searchValue = ('' + value).toLowerCase();
            const matchFirstName = ('' + staff.first_name).toLowerCase().includes(searchValue);
            const matchLastName = ('' + staff.last_name).toLowerCase().includes(searchValue);
            const matchFirstAndLastName = (staff.first_name + ' ' + staff.last_name).toLowerCase().includes(searchValue);
            return matchFirstName || matchLastName || matchFirstAndLastName;
        }
        return false;
    }

    getStaff() {
        this.StaffService.getStaff().then(response => {
            this.staff = response.data.results;
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