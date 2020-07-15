export default class MonthlyStatinDataEntryService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getUserCountries(user_id, permissionGroup, action) {
        return this.service.get(`api/user_permission/countries/${user_id}/?permission_group=${permissionGroup}&action=${action}`);
    }
    
    getOperationsData(country_id, year, month) {
        let year_month = year * 100 + month;
        return this.service.get(`api/operations-data/country/${country_id}/${year_month}/`);
    }
    
    setOperationsData(data) {
        return this.service.put('api/operations-data/country/', data);
    }
}