import StaffSelectTemplateUrl from './staff-select.html';
import './staff-select.less';

export class StaffSelectController {
    constructor(StaffService) {
        'ngInject';
        this.StaffService = StaffService;

        this.staffSelected = [];
        this.getStaff();
    }

    $onInit() {
        this.staffSelected.push(this.storedStaff);
    }

    getStaff() {
        this.StaffService.getStaff().then(response => {
            this.staff = response.data.results;
        });
    }
}

export default {
    bindings: {
        storedStaff: '<?'
    },
    controller: StaffSelectController,
    templateUrl: StaffSelectTemplateUrl,
    transclude: true
};