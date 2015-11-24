import BaseService from '../base.service';

class Address1Service extends BaseService {
	constructor ($http) {
		'ngInject';
		super();
        this.$http = $http;
	}

	listAddresses(queryParams) {
        return this.get('api/address1/', queryParams);
    }

    listAddress1s(){
        return this.get('api/address1/');
    }
	searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

	loadMoreAddresses(queryParams) {
        return this.get('api/address1/', queryParams);
    }

	saveAddress(address) {
        return this.put('api/address1/' + address.id + '/', address);
    }

    getFuzzyAddress1s (val) {
        return this.get('api/address1/fuzzy/?district=' + val);
    }
}

export default Address1Service;
