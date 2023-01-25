export default class SfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getSfList(queryParameters) {
        return this.service.get('api/sf/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=SF&form_present=true`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=SF&form_present=true&action=ADD`);
    }

    getMoreSfs(queryParameters) {
        return this.service.get('api/sf/', queryParameters);
    }

    deleteSf(stationId, id){
        return this.service.delete(`api/sf/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=SF&station_id=' + stationId);
    }
}
