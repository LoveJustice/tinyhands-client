import BaseService from '../../base.service';

export default class VifListService extends BaseService {
    constructor($http) {
        'ngInject';
        super($http);
    }

    deleteVif(id) {
        return this.delete(`api/vif/${id}/`);
    }

    getVifList() {
        return this.get('api/vif/');
    }
}
