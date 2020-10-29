export default class LegalCaseListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getLegalCaseList(queryParameters) {
        return this.service.get('api/legal-case/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=LEGAL_CASE&form_present=true`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=LEGAL_CASE&form_present=true&action=ADD`);
    }

    getMoreLegalCases(queryParameters) {
        return this.service.get('api/vdf/', queryParameters);
    }

    deleteLegalCase(stationId, id){
        return this.service.delete(`api/legal-case/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=LEGAL_CASE&station_id=' + stationId);
    }
}
