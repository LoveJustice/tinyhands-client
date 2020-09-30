

/* global angular */

export default class AuditSampleListController {
    constructor(AuditService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants) {
        'ngInject';
        this.service = AuditService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.constants = constants;
        this.countries = [];

        this.nextPage = "";
        this.queryParameters = {
            "page_size": 200,
            "reverse": true,
            "ordering": 'date_time_of_interception',
            "search": '',
            "status": 'approved',
            "country_ids": ''
        };
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;

        this.getAuditSampleList(this.stateParams.auditId);
        this.getAudit(this.stateParams.auditId);
    }

    getAuditSampleList(auditId) {
        this.spinnerOverlayService.show("Searching for Audit Samples...");        
        this.service.getAuditSampleList(auditId).then( (promise) => {
            this.auditSamples= promise.data.results;
            this.spinnerOverlayService.hide(); 
          //this.nextPage = this.extractPage(promise.data.next);
            for (let idx=0; idx < this.auditSamples.length; idx++) {
                let sample = this.auditSamples[idx];
                sample.url = this.state.href('auditSample', {
                    auditId: auditId,
                    id: sample.id
                });
                sample.incorrect = 0;
                for (let key in sample.results) {
                    if (sample.results[key]) {
                        sample.incorrect += sample.results[key];
                    }
                }
            }   
        });
    }
    
    getAccuracy(total, incorrect) {
        let result = '-';
        if (total && total > 0) {
            result = Math.round((total - incorrect) * 100 / total);
        }
        return result;
    }
    
    getAudit(auditId) {
        
        this.service.getAudit(auditId).then((promise) => {
            this.audit = promise.data;
            let questions = 0;
            for (let idx=0; idx < this.audit.template.length; idx++) {
                if (this.audit.template[idx].questions) {
                    questions += this.audit.template[idx].questions;
                }
            }
            this.audit.question_count = questions;
        });
    }
    
    getOverallAccuracy() {
        let result = '-';
        let totalQuestions = this.audit.samples_complete * this.audit.question_count;
        if (totalQuestions > 0) {
            result = Math.round((totalQuestions - this.audit.total_incorrect) * 100 / totalQuestions) + '%';
        }
        return result;
    }
    
    getFormsPassed() {
        let result = 'TBD';
        return result;
    }
    
    

    showMoreAudits() {
        let params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreAudits(this.transform(params)).then( (promise) => {
            this.vdfs = this.vdfs.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
            this.addUrls(this.vdfs);
        });
    }
}
