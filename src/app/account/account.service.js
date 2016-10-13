export default class AccountService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

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

    activateAccount(activationKey) {
        return this.service.get(`api/account/activate/${activationKey}/`);
    }

    create(data) {
        return this.service.post('api/account/', data);
    }

    resendActivationEmail(id) {
        return this.service.post(`api/account/resend-activation-email/${id}/`);
    }

    activateAccountPassword(activationKey, data) {
        return this.service.post(`api/account/activate/${activationKey}/`, data);
    }

    destroy(id) {
        return this.service.delete(`api/account/${id}/`);
    }
}
