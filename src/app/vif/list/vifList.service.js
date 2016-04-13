export default class VifListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    deleteVif(id) {
        return this.service.delete(`api/vif/${id}/`);
    }

    getVifList() {
        return this.service.get('api/vif/');
    }
}
