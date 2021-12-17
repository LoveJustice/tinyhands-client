export default class MonthlyStatinDataEntryService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getUserCountries(user_id, permissionGroup, action) {
        return this.service.get(`api/user_permission/countries/${user_id}/?permission_group=${permissionGroup}&action=${action}`);
    }
    
    getUserStations(user_id, permissionGroup, action, country_id) {
        return this.service.get(`api/user_permission/stations/${user_id}/?permission_group=${permissionGroup}&action=${action}&country_id=${country_id}&include_closed=true&feature=hasProjectStats`);
    }
    
    getStationData(country_id, yearMonth) {
        return this.service.get(`api/station-data/country/${country_id}/${yearMonth}/?feature=hasProjectStats`);
    }
    
    getProjectCategories() {
        return this.service.get(`api/border_station/category/`);
    }
    
    updateStationData(data) {
        return this.service.put('api/station-data/country/', data);
    }
    
    getExchangeRate(country_id, yearMonth) {
        return this.service.get(`api/exchange-rate/${country_id}/${yearMonth}/`);
    }
    
    updateExchangeRate(exchangeRate) {
        return this.service.put(`api/exchange-rate/`, exchangeRate);
    }
}