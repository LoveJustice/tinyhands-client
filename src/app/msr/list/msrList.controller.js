

export default class MsrListController {
    constructor(/*MsrListService,*/ SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants, moment) {
        'ngInject';
        //this.service = MsrListService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.constants = constants;
        this.moment = moment;
        this.countries = [];
        this.stationsForAdd = [];

        this.state.go('msrCommon'); 
    }
}
