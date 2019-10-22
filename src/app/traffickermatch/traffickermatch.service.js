class TraffickerMatchService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getKnownPersons(val, type, filter) {
        let endpoint = type === "name" ? "fuzzy" : "phone";
        return this.service.get(`api/idmgmt/${endpoint}/?${type}=${val}&filter=${filter}`);
    }
}

export default TraffickerMatchService;