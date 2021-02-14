
export default class AuditService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getAudit(id) {
        return this.service.get(`api/audit/${id}/`);
    }
    
    submitAudit(audit) {
        if (audit.id === null) {
            return this.service.post(`api/audit/`, audit);
        } else {
            return this.service.put(`api/audit/${audit.id}/`, audit);
        }
    }
    
    getSampleSize(country_id, form_id, start_date, end_date, percent) {
    	return this.service.get(`api/audit/sample-size/?country=${country_id}&form=${form_id}&start=${start_date}&end=${end_date}&percent=${percent}`);
    }
    
    updateNotes(audit) {
        if (audit.id === null) {
            return;
        }
        return this.service.put(`api/audit-notes/${audit.id}/`, audit);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=AUDIT`);
    }
    
    getFormTypes() {
        return this.service.get('api/forms/types/');
    }
    
    getForms() {
        return this.service.get('api/forms/');
    }
    
    getAuditList(queryParameters) {
        return this.service.get('api/audit/', queryParameters);
    }
    
    getFormConfig(formName) {
        return this.service.get(`api/forms/config/${formName}/`);
    }
    
    getFormCountries(formId) {
        return this.service.get(`api/forms/countries/${formId}/`);
    }
    
    getAuditSampleList(queryParams) {
        return this.service.get(`api/audit-sample/`, queryParams);
    }
    
    getAuditSample(id) {
        return this.service.get(`api/audit-sample/${id}/`);
    }
    
    submitAuditSample(auditSample) {
        return this.service.put(`api/audit-sample/${auditSample.id}/`, auditSample);
    }
}