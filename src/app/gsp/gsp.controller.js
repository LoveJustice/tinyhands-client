import './gsp.less';
const DateData = require('../dateData.js');

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
        this.professionDate = null;
        
        this.digits2Format = {'minimumFractionDigits': 2, 'maximumFractionDigits': 2};
        
        if (this.stateParams.id !== null && this.stateParams.id !== '') {
            this.accepted = 'Yes';
        }
        
        this.getGsp(this.stateParams.stationId, this.stateParams.id);
    }

    getGsp(stationId, id) {
        this.service.getGsp(id, stationId).then((response) => {
            this.gsp = response.data;
            if (this.gsp.profession_date) {
                let dateData = new DateData([]);
                this.professionDate = dateData.dateAsUTC(this.gsp.profession_date);
            }
        }, (error) => {alert(error);});
    }
    
    submit() {
        if (this.professionDate) {
            let dateData = new DateData([]);
            this.gsp.profession_date = dateData.dateToString(this.professionDate);
        }
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
