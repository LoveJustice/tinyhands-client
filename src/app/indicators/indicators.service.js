export default class IndicatorsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    calculate(country_id) {
        return this.service.get(`api/indicators/${country_id}`);
    }
    
    getUserCountries(id, permissionGroup) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=${permissionGroup}&form_present=true`);
    }
}