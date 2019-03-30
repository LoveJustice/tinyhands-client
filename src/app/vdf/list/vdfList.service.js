export default class VdfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getVdfList(queryParameters) {
        return this.service.get('api/vdf/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=VDF`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=VDF&action=ADD`);
    }

    getMoreVdfs(queryParameters) {
        return this.service.get('api/vdf/', queryParameters);
    }

    deleteVdf(stationId, id){
        return this.service.delete(`api/vdf/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=VDF&station_id=' + stationId);
    }
}
