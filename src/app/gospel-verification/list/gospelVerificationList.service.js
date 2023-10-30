export default class GospelVerificationListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getGospelVerificationList(queryParameters) {
        return this.service.get('api/gospel-verification/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=GOSPEL_VERIFICATION&form_present=true`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=PVF&station_id=' + stationId);
    }
}
