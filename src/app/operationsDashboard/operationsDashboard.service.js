export default class OperationsDashboardService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getUserCountries(user_id, permissionGroup, action) {
        return this.service.get(`api/user_permission/countries/${user_id}/?permission_group=${permissionGroup}&action=${action}`);
    }

    getOperationsDashboard(country_id) {
        return this.service.get(`api/operations-dashboard/${country_id}/`);
    }
}