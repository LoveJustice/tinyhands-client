export default class LfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getLfList(queryParameters) {
        return this.service.get('api/lf/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=LF&form_present=true`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=LF&form_present=true&action=ADD`);
    }

    getMoreLfs(queryParameters) {
        return this.service.get('api/lf/', queryParameters);
    }

    deleteLf(stationId, id){
        return this.service.delete(`api/lf/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=LF&station_id=' + stationId);
    }
}
