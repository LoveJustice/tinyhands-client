export default class GspListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getGspList(queryParameters) {
        return this.service.get('api/gsp/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=GSP`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=GSP&action=ADD`);
    }

    getMoreGsps(queryParameters) {
        return this.service.get('api/gsp/', queryParameters);
    }

    deleteGsp(stationId, id){
        return this.service.delete(`api/gsp/${stationId}/${id}/`);
    }
}
