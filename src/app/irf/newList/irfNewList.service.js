export default class IrfNewListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getIrfList(queryParameters) {
        return this.service.get('api/irfNew/', queryParameters);
    }
    
    getUserCountries(id) {
    	return this.service.get(`api/user_permission/countries/${id}/?permission_group=IRF`);
    }
    
    getUserStationsForAdd(id) {
    	return this.service.get(`api/user_permission/stations/${id}/?permission_group=IRF&action=ADD`);
    }

    getMoreIrfs(queryParameters) {
        return this.service.get('api/irfNew/', queryParameters);
    }

    deleteIrf(countryId, id){
        return this.service.delete(`api/irfNew/${countryId}/${id}/`);
    }

    irfExists(irfNumber) {
        return this.service.post(`data-entry/irfs/irfExists/${irfNumber}`);
    }

    getCsvExport() {
        return this.service.get('api/irf/export/');
    }
}
