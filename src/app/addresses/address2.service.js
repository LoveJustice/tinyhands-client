import BaseService from '../base.service';

class Address2Service extends BaseService {
	constructor ($http) {
		'ngInject';
		super();
        this.$http = $http;
	}

	listAddresses(queryParams) {
        return super.get('api/address2/', queryParams);
    }

	searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

	loadMoreAddresses(queryParams) {
        return super.get("api/address2/", queryParams);
    }

	saveAddress(address) {
        return super.put('api/address2/' + address.id + '/', address);
    }

    getFuzzyAddress2s (val) {
        return super.get('api/address2/fuzzy/?vdc=' + val);
    }
}

export default Address2Service;