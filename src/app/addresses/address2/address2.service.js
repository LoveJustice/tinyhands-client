class Address2Service {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listAddresses(queryParams) {
        return this.service.get('api/address2/', queryParams);
    }

    swapAddresses(id1, id2) {
        return this.service.delete(`api/address2/${id1}/swap-with/${id2}/`);
    }

    deleteAddress(id) {
        return this.service.delete(`api/address2/${id}/`);
    }

    searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

    loadMoreAddresses(queryParams) {
        return this.service.get('api/address2/', queryParams);
    }

    saveAddress(address) {
        return this.service.put('api/address2/' + address.id + '/', address);
    }

    getFuzzyAddress2s(val) {
        return this.service.get('api/address2/fuzzy/?address2=' + val);
    }

    getRelatedItems(address) {
        return this.service.get(`api/address2/${address.id}/related-items/`);
    }

    getAddress(id) {
        return this.service.get(`api/address2/${id}/`);
    }
}

export default Address2Service;
