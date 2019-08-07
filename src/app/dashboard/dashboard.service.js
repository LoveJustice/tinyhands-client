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
    
    getMapKey() {
        return this.service.get(`api/site-settings/google_map_key/`);
    }
}
export default DashboardService;
