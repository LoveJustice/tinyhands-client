class TraffickerMatchService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getKnownPersons(val, type) {
        let endpoint = type === "name" ? "fuzzy" : "phone";
        return this.service.get(`api/idmgmt/${endpoint}/?${type}=${val}&exclude=victims`);
    }
}

export default TraffickerMatchService;