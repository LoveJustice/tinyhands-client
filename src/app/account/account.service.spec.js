import AccountService from './account.service'

describe ('AccountService', () => {
    let service;

    let id=123,
    data = {id: 'dataId'},
    activationKey = 'abc';

    beforeEach(inject(($http) =>{
        service = new AccountService($http);
    }));

    describe('function getAccounts', () =>{
        let url = 'api/account/all/';
        it(`should get called with ${url}`, () =>{
            spyOn(service, 'get');
            service.getAccounts();
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getAccount', () =>{
        let url = `api/account/${id}/`;
        it(`should get called with ${url}`, () => {
            spyOn(service, 'get');
            service.getAccount(id);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getMe', () => {
        let url = 'api/me/';
        it(`should get called with ${url}`, () => {
            spyOn(service, 'get');
            service.getMe();
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function update', () =>{
        let url = `api/account/${id}/`;
        it(`should get called with ${url} and ${data}`, () => {
            spyOn(service, 'put');
            service.update(id, data);
            expect(service.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function activateAccount', () => {
        let url = `api/account/activate/${activationKey}/`;
        it(`should get called with ${url} and ${activationKey}`, () => {
            spyOn(service, 'get');
            service.activateAccount(activationKey);
            expect(service.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function create', () =>{
        let url = 'api/account/';
        it(`should get called with ${url} and ${data}`, () => {
            spyOn(service, 'post');
            service.create(data);
            expect(service.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function resendActivationEmail', () => {
        let url = `api/account/resend-activation-email/${id}/`;
        it(`should get called with ${url}`, () => {
            spyOn(service, 'post');
            service.resendActivationEmail(id);
            expect(service.post).toHaveBeenCalledWith(url);
        });
    });

    describe('function activateAccountPassword', () => {
        let url = `api/account/activate/${activationKey}/`;
        it(`should get called with ${url} and ${data}`, () => {
            spyOn(service, 'post');
            service.activateAccountPassword(activationKey, data);
            expect(service.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function destroy', () => {
        let url = `api/account/${id}/`;
        it(`should get called with ${url}`, () => {
            spyOn(service, 'delete');
            service.destroy(id);
            expect(service.delete).toHaveBeenCalledWith(url);
        });
    });


});
