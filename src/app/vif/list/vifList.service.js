import BaseService from '../../base.service';

export default class VifListService extends BaseService {
    constructor($http) {
        'ngInject';
        super($http);
    }

    getVifList() {
        return this.get('/api/vif/');
    }
}
