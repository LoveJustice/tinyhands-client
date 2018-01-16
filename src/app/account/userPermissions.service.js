export default class UserPermissionsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getPermissions() {
        return this.service.get('api/permission/');
    }

    getUserPermissions(id) {
        return this.service.get(`api/user_permission/${id}/`);
    }

    setUserPermissions(id, data) {
    		return this.service.put(`api/user_permission/${id}/`, data);
    }

    getAllCountries() {
    		return this.service.get('api/country/');
    }

    getBorderStations(open = null) {
        let params = [];
        if(open !== null) {
            params.push({name: 'open', value: open});
        }
        return this.service.get('api/border-station/', params);
    }
}