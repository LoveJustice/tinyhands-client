export default class OperationsDashboardService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getUserCountries(user_id, permissionGroup, action) {
        return this.service.get(`api/user_permission/countries/${user_id}/?permission_group=${permissionGroup}&action=${action}`);
    }
    
    getExchangeRate(country_id, yearMonth) {
        return this.service.get(`api/exchange-rate/${country_id}/${yearMonth}/`);
    }

    getOperationsDashboard(country_id) {
        return this.service.get(`api/operations-dashboard/${country_id}/`);
    }
}