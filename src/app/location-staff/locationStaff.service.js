export default class LocationStaffService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getUserCountries(user_id, permissionGroup, action) {
        return this.service.get(`api/user_permission/countries/${user_id}/?permission_group=${permissionGroup}&action=${action}&enable_all_locations=true`);
    }
    
    getUserStations(user_id, permissionGroup, action, country_id) {
        return this.service.get(`api/user_permission/stations/${user_id}/?permission_group=${permissionGroup}&action=${action}&country_id=${country_id}&transit_only=true`);
    }
    
    getStationLocations(station_id) {
        return this.service.get(`api/border-station/${station_id}/location/?include_inactive=true&location_type=monitoring`);
    }
    
    getStationStaff(station_id) {
        return this.service.get(`api/border-station/${station_id}/staff/?include_inactive=true`);
    }
    
    getLocationStaff(station_id, yearAndMonth) {
        return this.service.get(`api/location-staff/${station_id}/${yearAndMonth}/`);
    }
    
    setWorkFraction(theValue) {
        return this.service.put(`api/location-staff/`, theValue);
    }
}