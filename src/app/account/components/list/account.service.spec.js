import AccountService from './account.service'

describe ('AccountService', () => {
    let service;

    let id=123,
        data = {id: 'dataId'};

        beforeEach(inject(($http) =>{
            service = new AccountService($http);
        }));

        describe('function getAccounts', () =>{
            let url = '/api/account/all/';
            it(`should get called with ${url}`, () =>{
                spyOn(service, 'get');
                service.getAccounts();
                expect(service.get).toHaveBeenCalledWith(url);
            });
        });

        describe('function getAccount', () =>{
            let url = `/api/account/${id}/`;
            it(`should get called with ${url}`, (){
                spyOn(service, 'get');
                service.getAccount(id);
                expect(service.get).toHaveBeenCalledWith(url);
            });
        });

        describe('function getMe', () =>{
            let url = '/api/me/';
            it(`should get called with ${url}`, () =>{
                spyOn(service, 'get');
                service.getMe();
                expect(service.get).toHaveBeenCalledWith(url);
            });
        });

        describe('function update', () =>{
            let url = `/api/account/${id}/`;
            it(`should get called with ${url} and ${data}`, () => {
                spyOn(service, 'put');
                service.update(id, data);
                expect(service.update).toHaveBeenCalledWith(url, data);
            });
        });

        describe('function create', () =>{
            let url = '/api/account/';
            it(`should get called with ${url} and ${data}`, () => {
                spyOn(service, 'post');
                service.create(data);
                expect(service.create).toHaveBeenCalledWith(url, data);
            });
        });

        describe('function resendActivationEmail', () => {
            let url = `/api/account/resend-activation-email/${id}/`;
            it(`should get called with ${url}, () => {
                spyOn(service, 'post');
                service.resendActivationEmail(id);
                expect(service.resendActivationEmail).toHaveBeenCalledWith(url);
            });
        });

        describe('function destroy', () => {
            let url = `api/account/${id}/`;
            it(`should get called with ${url}, () => {
                spyOn(service, 'delete');
                service.destroy(id);
                expect(service.destroy).toHaveBeenCalledWith(url);
            });
        });
)};
