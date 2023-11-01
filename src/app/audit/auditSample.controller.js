import './audit.less';

export default class AuditSampleController {
    constructor(AuditService, SessionService, $state, $stateParams, toastr, constants) {
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
        
        this.isViewing = !this.session.checkPermission('AUDIT','SUBMIT_SAMPLE',null, null);
        this.getAuditSample();
        this.getAudit();
    }
    
    getAudit() {
        this.service.getAudit(this.stateParams.auditId).then((promise) => {
            this.audit = promise.data;
            this.isViewing = !this.session.checkPermission('AUDIT','SUBMIT_SAMPLE', this.audit.country, null);
        });
    }
    
    getAuditSample() {
        this.service.getAuditSample(this.stateParams.id).then((promise) => {
            this.auditSample = promise.data;
            let baseRoute = this.auditSample.form_name;
            if (this.auditSample.station_id !== null) {
                let params = {
                        id: this.auditSample.form_id,
                        stationId:this.auditSample.station_id,
                        countryId:this.auditSample.country_id,
                        isViewing:this.isViewing,
                        formName:this.auditSample.form_name,
                    };
                this.auditSample.ref = this.state.href(baseRoute, params);
            } else {
                this.auditSample.ref = null;
            }
            if (this.auditSample.corrected === null || this.auditSample.corrected === '') {
                this.auditSample.corrected = 'No';
            }
        });
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
