export default class PvfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getPvfList(queryParameters) {
        return this.service.get('api/pvf/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=PVF&form_present=true`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=PVF&form_present=true&action=ADD`);
    }

    getMorePvfs(queryParameters) {
        return this.service.get('api/pvf/', queryParameters);
    }

    deletePvf(stationId, id){
        return this.service.delete(`api/pvf/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=PVF&station_id=' + stationId);
    }
}
