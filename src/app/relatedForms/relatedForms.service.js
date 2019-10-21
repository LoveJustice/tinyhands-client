export default class RelatedFormsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
    
    deleteRelatedForm(formType, stationId, id) {
        let mapUrl = {
            'IRF':'irfNew',
            'CIF':'cif',
            'VDF':'vdf'
        };
        
        let formTypeUrlPart = mapUrl[formType];
        return this.service.delete(`api/${formTypeUrlPart}/${stationId}/${id}/`);
    }
}