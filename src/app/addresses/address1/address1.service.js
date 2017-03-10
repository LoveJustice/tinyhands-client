class Address1Service {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getAddress(id) {
        return this.service.get(`api/address1/${id}/`);
    }

    swapAddresses(id1, id2) {
        return this.service.delete(`api/address1/${id1}/swap-with/${id2}/`);
    }

    deleteAddress(id) {
        return this.service.delete(`api/address1/${id}/`);
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

    getRelatedItems(address) {
        return this.service.get(`api/address1/${address.id}/related-items/`);
    }
}

export default Address1Service;
