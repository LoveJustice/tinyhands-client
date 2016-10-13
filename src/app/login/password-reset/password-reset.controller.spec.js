import PasswordResetController from './password-reset.controller';

describe('PasswordResetController', () => {
    let vm, mockBaseService, mockToastr, deferred, $q, $rootScope;

    beforeEach(inject((_$q_, _$rootScope_) => {
        $q = _$q_;
        $rootScope = _$rootScope_;

        deferred = $q.defer();
        mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'post']);
        mockToastr = jasmine.createSpyObj('toastr', ['error', 'success']);

        mockBaseService.post.and.callFake(() => {
            return {"then": (f) => {
                f({"data": {"message": "success"}});
            }};
        });

        vm = new PasswordResetController(mockBaseService, mockToastr);
    }));

    describe('function constructor', () => {
        it('email should be empty string', () => {
            expect(vm.email).toEqual('');
        });
    });

    describe('function resetPassword', () => {
        it('should call the reset-password api with email', () => {
            let url = 'api/account/password-reset/';
            let obj = {email: vm.email};
            vm.resetPassword();
            expect(mockBaseService.post).toHaveBeenCalledWith(url, obj);
        });

        it('should call toastr with success message with success', () => {
            vm.email = "asdf@asfd.com";
            vm.resetPassword();
            expect(mockToastr.success).toHaveBeenCalledWith("success");
        });

        it('should call toastr with error message with error', () => {
            let reason = {"data": {"message": "asdf"}};
            mockBaseService.post.and.callFake(() => {
                return $q.reject(reason);
            });
            vm.resetPassword();
            $rootScope.$apply();

            expect(mockToastr.error).toHaveBeenCalledWith(reason.data.message);
        });
    });
});
