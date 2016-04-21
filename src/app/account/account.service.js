import BaseService from '../base.service';

export default class AccountService extends BaseService {
  constructor($http) {
	'ngInject';
	super($http);

	this.$http = $http;
  }

	// GETs
  getAccounts() {
	return this.get('/api/account/all/');
  }

  getAccount(id) {
    return this.get(`/api/account/${id}/`);
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

  resendActivationEmail(id){
    return this.post(`/api/account/resend-activation-email/${id}/`)
  }

  activateAccount(activateCode){
    return this.post(`/api/account/activate-account/${activateCode}/`)
  }

  // DELETE
  destroy(id) {
    return this.delete(`api/account/${id}/`);
  }
}
