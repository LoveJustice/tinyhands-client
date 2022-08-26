export default class CollectionIndicatorsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    calculate(country_id, startDate, endDate) {
        return this.service.get(`api/collection_indicators/${country_id}/?start_date=${startDate}&end_date=${endDate}`);
    }
    
    getUserCountries(id, permissionGroup) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=${permissionGroup}&form_present=true`);
    }
    
    getDetails(startDate, endDate, type, countryId, project) {
        let encodeType = encodeURIComponent(type);
        return this.service.get(`api/collection_indicators/detail/?start_date=${startDate}&end_date=${endDate}&type=${encodeType}&country_id=${countryId}&project=${project}`);
    }
}