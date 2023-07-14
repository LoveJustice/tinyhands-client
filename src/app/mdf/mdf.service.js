/**
 * Service to manage dataflow of budget form information between the client and
 * the backend.
 *
 * @export
 * @class MdfService
 */
export default class MdfService {
    constructor(BaseService, UtilService) {
        'ngInject';
        this.service = BaseService;
        this.utils = UtilService;
    }

    getMdf(id) {
    	return this.service.get(`api/mdf-pr/${id}/`);
    }
    
    updateMdf(mdf) {
    	return this.service.put(`api/mdf-pr/${mdf.id}/`, mdf);
    }
    
    deleteMdf(mdf) {
    	return this.service.delete(`api/mdf-pr/${mdf.id}/`);
    }
    
    createMdfItem(item) {
    	return this.service.post(`api/mdf-item/`, item);
    }
    
    updateMdfItem(item) {
    	return this.service.put(`api/mdf-item/${item.id}/`, item);
    }
    
    deleteMdfItem(item) {
    	return this.service.delete(`api/mdf-item/${item.id}/`);
    }
    
    approveMdf(mdf) {
    	return this.service.put(`api/mdf-pr/approve/${mdf.id}/`, mdf);
    }
}
