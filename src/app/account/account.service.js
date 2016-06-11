export default class AccountService{
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    // GETs
    getAccounts() {
        return this.service.get('api/account/all/');
    }

    getAccount(id) {
        return this.service.get(`api/account/${id}/`);
    }

    getMe() {
        return this.service.get('api/me/');
    }

    update(id, data) {
        return this.service.put(`api/account/${id}/`, data);
    }

    activateAccount(activationKey){
        return this.service.get(`api/account/activate/${activationKey}/`);
    }

    // POSTs
    create(data) {
        return this.service.post('api/account/', data);
    }

    resendActivationEmail(id){
        return this.service.post(`api/account/resend-activation-email/${id}/`);
    }

    activateAccountPassword(activationKey, data){
        return this.service.post(`api/account/activate/${activationKey}/`, data);
    }

    // DELETE
    destroy(id) {
        return this.service.delete(`api/account/${id}/`);
    }
}
