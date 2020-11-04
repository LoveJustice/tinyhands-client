import './audit.less';
const DateData = require('../dateData.js');

export default class AuditController {
    constructor(AuditService, SessionService, $state, $stateParams, toastr, constants) {
        'ngInject';
        this.service = AuditService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.toastr = toastr;
        this.constants = constants;
        this.countries = [];
        this.countryId = null;
        this.forms = [];
        this.formId = null;
        
        this.start_date = null;
        this.end_date = null;
        
        this.audit = {
            id:null,
            form:null,
            form_name:null,
            country:null,
            start_date:null,
            end_date:null,
            percent_to_sample:null,
            notes: '',
            template:[],     
        };
        
        this.isViewing = this.stateParams.isViewing === 'true';
        
        if (this.stateParams.auditId) {
            this.audit.id = this.stateParams.auditId;
            this.getAudit();
        } else {
            this.audit.author = this.session.user.id;
        }

        this.getForms();
    }

    getForms() {
        this.service.getForms().then ((promise) => {
            let forms = [];
            for (let idx=0; idx < promise.data.length; idx++) {
                if (promise.data[idx].form_type.name === 'IRF' || promise.data[idx].form_type.name === 'CIF' || promise.data[idx].form_type.name === 'VDF') {
                    forms.push(promise.data[idx]);
                }
            }
            this.forms = forms;
        });
    }
    
    getFormCountries() {
        if (this.audit.form === null) {
            return;
        }
        this.service.getFormCountries(this.audit.form).then((promise) => {
            this.countries = promise.data;
            if (this.audit.country === null && this.countries.length === 1) {
                this.audit.country = ''+this.countries[0].id;
            }
        });
    }
    
    changeForm() {
        this.getFormCountries();
        let formName = null;
        for (let idx=0; idx < this.forms.length; idx++) {
            if (this.audit.form === ''+this.forms[idx].id) {
                formName = this.forms[idx].form_name;
                this.audit.form_name = formName;
                break;
            }
        }
        
        if (formName !== null && this.audit.id === null) {
            this.service.getFormConfig(formName).then((promise) => {
                this.audit.template = [];
                for (let idx=0; idx < promise.data.Categories.length; idx++) {
                    this.audit.template.push({
                        "name":promise.data.Categories[idx],
                        "questions":null
                    });
                }
            });
        }
    }
    
    getAudit() {
        if (!this.audit.id) {
            return;
        }
        
        this.service.getAudit(this.audit.id).then((promise) => {
            this.audit = promise.data;
            this.audit.form = '' + this.audit.form;
            this.audit.country = '' + this.audit.country;
            let dateData = new DateData([]);
            this.start_date = dateData.dateAsUTC(this.audit.start_date);
            this.end_date = dateData.dateAsUTC(this.audit.end_date);
            this.getFormCountries();
        });
    }
    
    submit() {
        let dateData = new DateData([]);
        this.audit.start_date = dateData.dateToString(this.start_date);
        this.audit.end_date = dateData.dateToString(this.end_date);
        
        
        this.service.submitAudit(this.audit).then(() => {
            this.state.go('auditList');
        }, (error)=>{alert(error);});
    }
}
