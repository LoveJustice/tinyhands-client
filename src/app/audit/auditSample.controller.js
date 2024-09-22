import './audit.less';

export default class AuditSampleController {
    constructor(AuditService, SessionService, BaseUrlService, $state, $stateParams, toastr, constants) {
        'ngInject';
        this.service = AuditService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.toastr = toastr;
        this.constants = constants;
        this.digits1Format = {'minimumFractionDigits': 1, 'maximumFractionDigits': 1};

        this.audit = null;
        this.auditSample = null;

        this.getReactUrl = (path) => {
           return BaseUrlService.getReactUrl(path);
        };

        this.isViewing = !this.session.checkPermission('AUDIT', 'SUBMIT_SAMPLE', null, null);

        this.getAudit()
            .then(() => this.getAuditSample())
            .then(() => this.setSampleRef());
    }

    getAudit() {
        return this.service.getAudit(this.stateParams.auditId).then((promise) => {
            this.audit = promise.data;
            this.isViewing = !this.session.checkPermission('AUDIT', 'SUBMIT_SAMPLE', this.audit.country, null);
        });
    }

    getAuditSample() {
        return this.service.getAuditSample(this.stateParams.id).then((promise) => {
            this.auditSample = promise.data;
            if (this.auditSample.corrected === null || this.auditSample.corrected === '') {
                this.auditSample.corrected = 'No';
            }
        });
    }

    setSampleRef() {
        // May need to find a better way to get the form name / path to ensure we reliably get the right path here
        let path = this.audit.form_type_name + '/' + this.auditSample.form_id;
        if (this.auditSample.station_id !== null) {
            let reactParams = new URLSearchParams({
                countryName: this.audit.country_name,
                stationId: this.auditSample.station_id,
                countryId: this.auditSample.country_id
            }).toString();

            // Combine baseRoute with query string
            let reactPath = `${path}/view?${reactParams}`;

            this.auditSample.ref = this.getReactUrl(reactPath);
        } else {
            this.auditSample.ref = null;
        }
    }

    
    getTotal() {
        let total = 0;
        for (let idx=0; idx < this.audit.template.length; idx++) {
            total += this.audit.template[idx].questions;
        }
        return total;
    }
    
    getTotalIncorrect () {
        let total = 0;
        for (let key in this.auditSample.results) {
            if (this.auditSample.results[key]) {
                total += this.auditSample.results[key];
            }
        }
        return total;
    }
    
    getAccuracy () {
        let result = '-';
        let questions = this.getTotal();
        if (questions > 0) {
            result = Math.floor((questions - this.getTotalIncorrect()) * 1000 / questions)/10;
        }
        return result;
    }
    
    submit() {
        if (!this.auditSample.auditor) {
            this.auditSample.auditor = this.session.user.id;
        }
        if (!this.auditSample.completion_date) {
            let dt = new Date();
            let dateString = '';
            dateString = dt.getFullYear() + '-';
            if (dt.getMonth() < 9) {
                dateString += '0';
            }
            dateString += (dt.getMonth()+1) + "-";
            if (dt.getDate() <= 9) {
                dateString += '0';
            }
            dateString += dt.getDate();
            this.auditSample.completion_date = dateString;
        }
        
        
        
        this.service.submitAuditSample(this.auditSample).then(() => {
            this.state.go('auditSampleList', {
                auditId: this.stateParams.auditId,
            });
        });
    }
}
