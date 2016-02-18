import BaseService from '../../../base.service';

export default class AccountService extends BaseService {
	constructor($http, $q) {
		'ngInject';
		super();
		
		
		this.$http = $http;
		this.$q = $q;
	}

	// GETs
	getAccounts() {
		return this.get('/api/account/all/')
	}

	getUser() {
		return this.get('/api/me/')
	}
}