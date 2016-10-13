class Address1Service {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listAddresses(queryParams) {
        return this.service.get('api/address1/', queryParams);
    }

    listAddress1s() {
        return this.service.get('api/address1/');
    }
    searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

    loadMoreAddresses(queryParams) {
        return this.service.get('api/address1/', queryParams);
    }

    saveAddress(address) {
        return this.service.put('api/address1/' + address.id + '/', address);
    }

    getFuzzyAddress1s(val) {
        return this.service.get('api/address1/fuzzy/?address1=' + val);
    }
}

export default Address1Service;
