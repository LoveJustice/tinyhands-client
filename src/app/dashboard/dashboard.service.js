class DashboardService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=STATIONS`);
    }
    
    getUserStations(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=STATIONS`);
    }
}
export default DashboardService;
