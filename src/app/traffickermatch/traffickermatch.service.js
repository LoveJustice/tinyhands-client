class TraffickerMatchService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getFuzzyKnownPersons(val) {
        return this.service.get(`api/idmgmt/fuzzy/?name=${val}&exclude=victims`);
    }

    getPhoneKnownPersons(val) {
        return this.service.get(`api/idmgmt/phone/?phone=${val}&exclude=victims`);
    }

    getKnownPersonForms(val) {
        return this.service.get(`api/idmgmt/forms/?person_id=${val}`);
    }
}

export default TraffickerMatchService;