export default class IrfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    createIrf(data) {
        return this.service.post('api/irf/', data);
    }

    getIrf(id) {
        return this.service.get(`api/irf/${id}/`);
    }
}