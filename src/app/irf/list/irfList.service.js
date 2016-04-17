export default class IrfListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getIrfList() {
        return this.service.get('api/irf/');
    }

    deleteIrf(id){
        return this.service.delete(`/api/irf/${id}/`);
    }
}
