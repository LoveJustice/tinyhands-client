export default class BorderStationService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getStaff(id) {
    	if (id) {
    		return this.service.get(`api/staff/${id}/`);
    	} else {
    		return this.service.get(`api/staff/blank/`);
    	}
    }
    
	getStaffList(queryParameters) {
		return this.service.get('api/staff/', queryParameters);
	}
	
	submitStaff(staff) {
		if (staff.id === null) {
			return this.service.post(`api/staff/`, staff);
		} else {
			return this.service.put(`api/staff/${staff.id}/`, staff);
		}
	}
	
	getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=PROJECTS`);
    }
    
    getUserStations(id) {
        let params = [];
      
        params.push({name: 'permission_group', value: 'PROJECTS'});
        params.push({name: 'action', value: 'VIEW'});

        return this.service.get(`api/user_permission/stations/${id}/`, params);
    }
}
