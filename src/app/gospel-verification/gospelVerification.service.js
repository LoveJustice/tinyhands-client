// Common service used for all Gospel Verification forms
export default class GospelVerificationService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getGospelVerification(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/gospel-verification/${stationId}/${id}/`);
        }
    }
    
    submitGospelVerification(stationId, id, gospelVerification) {
        let formData = new FormData();
        formData.append("main", JSON.stringify(gospelVerification));
        return this.service.put(`api/gospel-verification/${stationId}/${id}/`, formData, {'Content-Type': undefined});
    }
    
    getVdf(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/vdf/${stationId}/${id}`);
        }
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/`;
        return this.service.get(url);
    }
}