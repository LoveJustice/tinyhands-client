import './emp.less';
export default class EmpController {
    constructor($scope, $uibModal, constants, EmpService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        
        this.stateParams = $stateParams;
        this.modalStack = $uibModalStack;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = EmpService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.session = SessionService;
        this.isViewing = this.stateParams.isViewing === 'true';
        
        this.digits2Format = {'minimumFractionDigits': 2, 'maximumFractionDigits': 2};
        
        if (this.stateParams.id !== null && this.stateParams.id !== '') {
            this.threeMonths = 'Yes';
        }
        
        this.getEmp(this.stateParams.stationId, this.stateParams.id);
    }

    getEmp(stationId, id) {
        this.service.getEmp(id, stationId).then((response) => {
            this.emp = response.data;
            if (this.emp.pre_emp_usd !== null && this.emp.pre_emp_usd !== '') {
                this.emp.pre_emp_usd = +(this.emp.pre_emp_usd)
            }
            if (this.emp.post_emp_usd !== null && this.emp.post_emp_usd !== '') {
                this.emp.post_emp_usd = +(this.emp.post_emp_usd)
            }
            
            this.monthlyLevels = [];
            for (let idx in this.emp.levels) {
                this.monthlyLevels[idx] = this.emp.levels[idx] * 365/12.0;
            }
        }, (error) => {alert(error);});
    }
    
    computeLevels() {
        if (this.emp.pre_emp_usd && this.emp.post_emp_usd) {
            let lines = 0;
            for (let idx in this.monthlyLevels) {
                if (this.emp.pre_emp_usd < this.monthlyLevels[idx] && this.emp.post_emp_usd >= this.monthlyLevels[idx]) {
                    lines += 1;
                }
            }
            this.emp.lines_crossed = lines;
        }
    }
    
    submit() {
        this.service.submitEmp(this.stateParams.stationId, this.stateParams.id, this.emp).then((response) => {
             this.emp = response.data;
             this.state.go('empList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
}
