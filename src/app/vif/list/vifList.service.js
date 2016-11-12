export default class VifListService {
    constructor(BaseService, StickyHeader) {
        'ngInject';
        this.service = BaseService;
        this.sticky = StickyHeader.sticky;
    }

    deleteVif(id) {
        return this.service.delete(`api/vif/${id}/`);
    }

    getVifList(queryParameters) {
        return this.service.get('api/vif/', queryParameters);
    }

    getMoreVifs(queryParameters) {
        return this.service.get('api/vif/', queryParameters);
    }
}
