import StaffSelectTemplateUrl from './staff-select.html';
import './staff-select.less';

export class StaffSelectController {
    constructor(StaffService) {
        'ngInject';
        this.StaffService = StaffService;

        this.StaffSelected = [];
        this.getStaff();
    }

    $onInit() {
        this.StaffSelected.push(this.selectedStaff);
    }

    getStaff() {
        this.StaffService.getStaff().then(response => {
            this.staff = response.data.results;
        });
    }
}

export default {
    bindings: {
        selectedStaff: '<?'
    },
    controller: StaffSelectController,
    templateUrl: StaffSelectTemplateUrl,
    transclude: true
};