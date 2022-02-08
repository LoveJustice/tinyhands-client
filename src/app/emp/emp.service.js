export default class EmpService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [692];
    }
    
    getEmp(id, stationId) {
        if (id !== null) {
            return this.service.get(`api/emp/${id}/`);
        } else {
            return this.service.get(`api/emp/blank/${stationId}/`);
        }
    }
    
    submitEmp(stationId, id, emp) {
        if (id === null) {
            return this.postEmp(emp);
        } else {
            return this.putEmp(stationId, id, emp);
        }
    }
    
    putEmp(stationId, id, emp) {
        return this.service.put(`api/emp/${id}/`, emp);
    }
    
    postEmp(emp) {
        return this.service.post(`api/emp/`, emp);
    }
}