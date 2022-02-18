export default class GspService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [692];
    }
    
    getGsp(id, stationId) {
        if (id !== null) {
            return this.service.get(`api/gsp/${id}/`);
        } else {
            return this.service.get(`api/gsp/blank/${stationId}/`);
        }
    }
    
    submitGsp(stationId, id, gsp) {
        if (id === null) {
            return this.postGsp(gsp);
        } else {
            return this.putGsp(stationId, id, gsp);
        }
    }
    
    putGsp(stationId, id, gsp) {
        return this.service.put(`api/gsp/${id}/`, gsp);
    }
    
    postGsp(gsp) {
        return this.service.post(`api/gsp/`, gsp);
    }
}