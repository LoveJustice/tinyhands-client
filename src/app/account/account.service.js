import BaseService from '../base.service';

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
		return this.get('api/account/all/');
	}

  getAccount(id) {
    return this.get(`api/account/${id}/`);
  }

	getMe() {
		return this.get('api/me/');
	}

	update(id, data) {
		return this.put(`api/account/${id}/`, data);
	}

  activateAccount(activationKey){
    return this.get(`api/account/activate/${activationKey}/`);
  }

  // POSTs
  create(data) {
    return this.post('api/account/', data);
	}

  resendActivationEmail(id){
    return this.post(`api/account/resend-activation-email/${id}/`)
	}

  activateAccountPassword(activationKey, data){
    return this.post(`api/account/activate/${activationKey}/`, data);
  }

  // DELETE
  destroy(id) {
      return this.delete(`api/account/${id}/`);
  }
}
