export default class UserPermissionsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getPermissions() {
        return this.service.get('api/permission/?page_size=1000');
    }

    getUserPermissions(id) {
        return this.service.get(`api/user_permission/${id}/`);
    }

    setUserPermissions(id, data) {
        return this.service.put(`api/user_permission/${id}/`, data);
    }
    
    getUserPermissionsList(countryId, stationId) {
        let params = [];
        if (stationId !== null) {
            params.push({name: 'station_id', value: stationId});
        } else if (countryId !== null) {
            params.push({name: 'country_id', value: countryId});
        }
        
        return this.service.get('api/user_permission_list/', params);
    }

    getAllCountries() {
        return this.service.get('api/country/');
    }
    
    getUserStations(id) {
        return this.service.get(`api/user_permission/stations/${id}/`);
    }

    getBorderStations(open = null) {
        let params = [];
        if(open !== null) {
            params.push({name: 'open', value: open});
        }
        return this.service.get('api/border-station/', params);
    }
}