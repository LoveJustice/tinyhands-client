import AccountListController from './accountList.controller';

describe('AccountListController', () => {
    let controller,
        mockAccountService,
        mockStickyHeader,
        rootScope,
        $q,
        getMeResponse,
        getAccountsResponse,
        mockToastr;

    beforeEach(inject((_$q_, $rootScope) => {
        $q = _$q_;
        rootScope = $rootScope;

        mockAccountService = jasmine.createSpyObj('mockAccountService', ['getMe', 'getAccounts', 'resendActivationEmail', 'destroy']);

        getMeResponse = { data: { id: 1, name: 'Foo' } };
        mockAccountService.getMe.and.callFake(() => {
            return $q.resolve(getMeResponse);
        });

        getAccountsResponse = { data: [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }] };
        mockAccountService.getAccounts.and.callFake(() => {
            return $q.resolve(getAccountsResponse);
        });

        mockAccountService.resendActivationEmail.and.callFake(() => {
            return $q.resolve();
        });

        mockAccountService.destroy.and.callFake(() => {
            return $q.resolve();
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        mockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);

        controller = new AccountListController(mockAccountService, mockStickyHeader, mockToastr);
    }));

    describe('getCurrentUser', () => {
        it('should get user from AccountService', () => {
            controller.getCurrentUser();

            expect(mockAccountService.getMe).toHaveBeenCalled();
        });

        it('should set current user', () => {
            controller.getCurrentUser();
            rootScope.$apply();

            expect(controller.currentUser).toEqual(getMeResponse.data);
        });
    });

    describe('getAccounts', () => {
        it('should get accounts from AccountService', () => {
            controller.getAccounts();

            expect(mockAccountService.getAccounts).toHaveBeenCalled();
        });

        it('should set accounts', () => {
            controller.getAccounts();
            rootScope.$apply();

            expect(controller.accounts).toEqual(getAccountsResponse.data)
        });
    });

    describe('resendActivationEmail', () => {
        it('should resend activation email using AccountService', () => {
            let accountId = 7;

            controller.resendActivationEmail(accountId);

            expect(mockAccountService.resendActivationEmail).toHaveBeenCalledWith(accountId);
        });

        describe('when resending email is successful', () => {
            it('should show success message', () => {
                controller.resendActivationEmail(2);
                rootScope.$apply();

                expect(mockToastr.success).toHaveBeenCalled();
            });
        });

        describe('when resending email is not successful', () => {
            it('should show erorr message', () => {
                mockAccountService.resendActivationEmail.and.callFake(() => {
                    return $q.reject();
                });

                controller.resendActivationEmail(2);
                rootScope.$apply();

                expect(mockToastr.error).toHaveBeenCalled();
            });
        });
    });

    describe('deleteAccount', () => {
        describe('when current tries to delete himself', () => {
            it('should not call destroy on AccountService', () => {
                let account = { id: 1 };
                controller.currentUser = account;

                controller.deleteAccount(account);

                expect(mockAccountService.destroy).not.toHaveBeenCalled();
            });
        });

        it('should call destroy on AccountService', () => {
            let account = { id: 2 };
            rootScope.$apply();

            controller.deleteAccount(account);

            expect(mockAccountService.destroy).toHaveBeenCalledWith(account.id);
        });

        describe('when deleting an account is successful', () => {
            it('should show successful toastr message', () => {
                let account = { id: 2 };
                rootScope.$apply();

                controller.deleteAccount(account);
                rootScope.$apply();

                expect(mockToastr.success).toHaveBeenCalled();
            });

            it('should get accounts', () => {
                let account = { id: 2 };
                rootScope.$apply();
                spyOn(controller, 'getAccounts');

                controller.deleteAccount(account);
                rootScope.$apply();

                expect(controller.getAccounts).toHaveBeenCalled();
            });
        });
    });
});