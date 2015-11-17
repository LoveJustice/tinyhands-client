import BaseService from '../base.service';

class Address2Service extends BaseService {
	constructor ($http) {
		'ngInject';
		super($http);
	}

	listAddresses(queryParams) {
        return super.get('api/address2/', queryParams);
    }

	searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

	loadMoreAddresses(queryParams) {
        return super.get("api/address2/" + queryParams);
    }

	saveAddress(address) {
        return super.put('api/address2/' + address.id + '/', address);
    }

    listAddress1s(){
        return super.get('api/address1/');
    }
}

export default Address2Service;