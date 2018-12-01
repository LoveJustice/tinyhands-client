export default class CifListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getCifList(queryParameters) {
        return this.service.get('api/cif/', queryParameters);
    }
    
    getUserCountries(id) {
    	return this.service.get(`api/user_permission/countries/${id}/?permission_group=CIF`);
    }
    
    getUserStationsForAdd(id) {
    	return this.service.get(`api/user_permission/stations/${id}/?permission_group=CIF&action=ADD`);
    }

    getMoreCifs(queryParameters) {
        return this.service.get('api/cif/', queryParameters);
    }

    deleteCif(stationId, id){
        return this.service.delete(`api/cif/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
    	return this.service.get('api/forms/?type_name=CIF&station_id=' + stationId);
    }
}
