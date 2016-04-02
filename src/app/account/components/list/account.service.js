import BaseService from '../../../base.service';

export default class AccountService extends BaseService {
	constructor($http, $q, $timeout) {
		'ngInject';
		super();

		this.$http = $http;
		this.$q = $q;
    this.$timeout = $timeout;
	}

	// GETs
	getAccounts() {
		return this.get('/api/account/all/');
	}

	getMe() {
		return this.get('/api/me/');
	}

	update(id, data) {
		return this.put(`/api/account/${id}/`, data);
	}

  // POSTs
  create(data) {
    return this.post('/api/account/', data);
  }

  getAccount(id) {
    return this.get(`/api/account/${id}/`);
  }

  // DELETE
  destroy(id) {
    return this.delete(`api/account/${id}/`);
  }

}