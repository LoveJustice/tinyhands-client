import './gsp.less';
export default class GspController {
    constructor($scope, $uibModal, constants, GspService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        
        this.stateParams = $stateParams;
        this.modalStack = $uibModalStack;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = GspService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.session = SessionService;
        this.isViewing = this.stateParams.isViewing === 'true';
        
        this.digits2Format = {'minimumFractionDigits': 2, 'maximumFractionDigits': 2};
        
        if (this.stateParams.id !== null && this.stateParams.id !== '') {
            this.accepted = 'Yes';
        }
        
        this.getGsp(this.stateParams.stationId, this.stateParams.id);
    }

    getGsp(stationId, id) {
        this.service.getGsp(id, stationId).then((response) => {
            this.gsp = response.data;
            if (this.gsp.pre_gsp_usd !== null && this.gsp.pre_gsp_usd !== '') {
                this.gsp.pre_gsp_usd = +(this.gsp.pre_gsp_usd)
            }
            if (this.gsp.post_gsp_usd !== null && this.gsp.post_gsp_usd !== '') {
                this.gsp.post_gsp_usd = +(this.gsp.post_gsp_usd)
            }
            
            this.monthlyLevels = [];
            for (let idx in this.gsp.levels) {
                this.monthlyLevels[idx] = this.gsp.levels[idx] * 365/12.0;
            }
        }, (error) => {alert(error);});
    }
    
    submit() {
        this.service.submitGsp(this.stateParams.stationId, this.stateParams.id, this.gsp).then((response) => {
             this.gsp = response.data;
             this.state.go('gspList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
}
