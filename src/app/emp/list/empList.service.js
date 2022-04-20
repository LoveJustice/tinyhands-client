export default class EmpListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getEmpList(queryParameters) {
        return this.service.get('api/emp/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=EMP`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=EMP&action=ADD`);
    }

    getMoreEmps(queryParameters) {
        return this.service.get('api/emp/', queryParameters);
    }

    deleteEmp(stationId, id){
        return this.service.delete(`api/emp/${stationId}/${id}/`);
    }
}
