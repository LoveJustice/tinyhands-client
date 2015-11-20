import BaseService from '../base.service';

class Address1Service extends BaseService {
	constructor ($http) {
		'ngInject';
		super();
        this.$http = $http;
	}

	listAddresses(queryParams) {
        return super.get('api/address1/', queryParams);
    }

    listAddress1s(){
        return super.get('api/address1/');
    }
	searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

	loadMoreAddresses(queryParams) {
        return super.get("api/address1/", queryParams);
    }

	saveAddress(address) {
        return super.put('api/address1/' + address.id + '/', address);
    }

    getFuzzyAddress1s (val) {
        return super.get('api/address1/fuzzy/?district=' + val);
    }
}

export default Address1Service;
