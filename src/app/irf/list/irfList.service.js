import BaseService from '../../base.service';

export default class IrfListService extends BaseService {
    constructor($http) {
        'ngInject';
        super($http);
    }

    getIrfList() {
        return this.get('/api/irf/');
    }

    deleteIrf(id){
        return this.delete('/api/irf/${id}/');
    }
}
