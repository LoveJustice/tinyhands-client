import BaseService from '../base.service';

class Address2Service extends BaseService {
	constructor ($http) {
		'ngInject';
		super($http);
	}

	listAddresses(queryParams) {
        return super.get('api/address2/', queryParams).
            success((data) => {
                return data;
            });
    }

	searchAddresses(queryParams) {
        return this.listAddresses(queryParams);
    }

	loadMoreAddresses(queryParams) {
        return super.get("api/address2/" + queryParams).
            success((data) => {
                return data;
            });
    }

	saveAddress(address) {
        return super.put('api/address2/' + address.id + '/', address).
            success((data) => {
                return data;
            });
    }

    listAddress1s(){
        return super.get('api/address1/')
            .success((data) => {
                return data;
            });
    }
}

export default Address2Service;