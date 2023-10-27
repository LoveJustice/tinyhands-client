import AccountService from './account.service'

describe('AccountService', () => {
    let service,
        mockBaseSerivce;

    let id = 123,
        data = { id: 'dataId' },
        activationKey = 'abc';

    beforeEach(() => {
        mockBaseSerivce = jasmine.createSpyObj('mockBaseSerivce', ['get', 'post', 'put', 'delete']);
        service = new AccountService(mockBaseSerivce);
    });

    describe('getAccounts', () => {
        it('should call BaseService.get with correct url', () => {
            let url = 'api/account/?page_size=10000';

            service.getAccounts();

            expect(mockBaseSerivce.get).toHaveBeenCalledWith(url);
        });
    });

    describe('getAccount', () => {
        it('should call BaseService.get with correct url', () => {
            let url = `api/account/${id}/`;

            service.getAccount(id);

            expect(mockBaseSerivce.get).toHaveBeenCalledWith(url);
        });
    });

    describe('getMe', () => {
        it('should call BaseService.get with correct url', () => {
            let url = 'api/me/';

            service.getMe();

            expect(mockBaseSerivce.get).toHaveBeenCalledWith(url);
        });
    });

    describe('update', () => {
        it('should call BaseService.put with correct url and data', () => {
            let url = `api/account/${id}/`;

            service.update(id, data);

            expect(mockBaseSerivce.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('activateAccount', () => {
        it('should call BaseService.get with correct url', () => {
            let url = `api/account/activate/${activationKey}/`;

            service.activateAccount(activationKey);

            expect(mockBaseSerivce.get).toHaveBeenCalledWith(url);
        });
    });

    describe('create', () => {
        it('should call BaseService.post with correct url and data', () => {
            let url = 'api/account/';

            service.create(data);

            expect(mockBaseSerivce.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('resendActivationEmail', () => {
        it('should call BaseService.post with correct url', () => {
            let url = `api/account/resend-activation-email/${id}/`;

            service.resendActivationEmail(id);

            expect(mockBaseSerivce.post).toHaveBeenCalledWith(url);
        });
    });

    describe('activateAccountPassword', () => {
        it('should call BaseService.post with correct url and data', () => {
            let url = `api/account/activate/${activationKey}/`;

            service.activateAccountPassword(activationKey, data);

            expect(mockBaseSerivce.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('destroy', () => {
        it('should call BaseService.delete with correct url', () => {
            let url = `api/account/${id}/`;

            service.destroy(id);

            expect(mockBaseSerivce.delete).toHaveBeenCalledWith(url);
        });
    });


});
