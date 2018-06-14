import StaffSelectTemplateUrl from './staff-select.html';
import './staff-select.less';

export class StaffSelectController {
    constructor(StaffService) {
        'ngInject';
        this.StaffService = StaffService;

        this.getStaff();
    }

    filterStaff(staff, value) {
        if (staff && value) {
            const SearchValue = ('' + value).toLowerCase();
            const MatchFirstName = _.includes(('' + staff.first_name).toLowerCase(), SearchValue);
            const MatchLastName = _.includes(('' + staff.last_name).toLowerCase(), SearchValue);
            const MatchFirstAndLastName = _.includes((staff.first_name + ' ' + staff.last_name).toLowerCase(), SearchValue);
            return MatchFirstName || MatchLastName || MatchFirstAndLastName;
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